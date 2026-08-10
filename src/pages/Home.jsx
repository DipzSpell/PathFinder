import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Landing from '../components/Landing'
import ForwardForm from '../components/ForwardForm'
import ReverseForm from '../components/ReverseForm'
import Loading from '../components/Loading'
import Roadmap from '../components/Roadmap'
import ErrorState from '../components/ErrorState'
import { getForwardRoadmap, getReverseRoadmap } from '../gemini'

export default function Home() {
  const [screen, setScreen] = useState('landing')
  const [flow, setFlow] = useState(null)
  const [formData, setFormData] = useState(null)
  const [roadmap, setRoadmap] = useState(null)
  const [error, setError] = useState(null)
  const requestRef = useRef(null)
  const location = useLocation()

  const abortPending = () => {
    requestRef.current?.abort()
    requestRef.current = null
  }

  useEffect(() => abortPending, [])

  const generate = useCallback(async (nextFlow, data) => {
    abortPending()
    const controller = new AbortController()
    requestRef.current = controller

    setFlow(nextFlow)
    setFormData(data)
    setError(null)
    setScreen('loading')

    try {
      const fetcher = nextFlow === 'forward' ? getForwardRoadmap : getReverseRoadmap
      const result = await fetcher(data, controller.signal)
      if (controller.signal.aborted) return
      setRoadmap(result)
      setScreen('results')
    } catch (err) {
      if (controller.signal.aborted) return
      setError(err.message)
      setScreen('error')
    } finally {
      if (requestRef.current === controller) requestRef.current = null
    }
  }, [])

  const handlePick = (picked) => {
    setFlow(picked)
    setScreen(picked === 'forward' ? 'forward-form' : 'reverse-form')
  }

  const handleBack = () => {
    abortPending()
    setScreen('landing')
  }

  const handleRestart = useCallback(() => {
    abortPending()
    setRoadmap(null)
    setError(null)
    setFormData(null)
    setFlow(null)
    setScreen('landing')
  }, [])

  // The header logo links to "/" with a fresh `reset` stamp, so clicking it while already
  // on the home route still clears a finished roadmap.
  useEffect(() => {
    if (location.state?.reset) handleRestart()
  }, [location.state?.reset, handleRestart])

  const handleRetry = () => {
    if (flow && formData) generate(flow, formData)
    else handleRestart()
  }

  return (
    <div key={screen} className="screen-enter">
      {screen === 'landing' && <Landing onPick={handlePick} />}
      {screen === 'forward-form' && (
        <ForwardForm onSubmit={(data) => generate('forward', data)} onBack={handleBack} />
      )}
      {screen === 'reverse-form' && (
        <ReverseForm onSubmit={(data) => generate('reverse', data)} onBack={handleBack} />
      )}
      {screen === 'loading' && <Loading flow={flow} />}
      {screen === 'error' && (
        <ErrorState message={error} onRetry={handleRetry} onRestart={handleRestart} />
      )}
      {screen === 'results' && roadmap && (
        <Roadmap roadmap={roadmap} flow={flow} onRestart={handleRestart} />
      )}
    </div>
  )
}
