const EMPTY_VALUES = new Set(['', 'null', 'none', 'n/a', 'na', 'undefined'])

export function cleanText(value) {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return EMPTY_VALUES.has(trimmed.toLowerCase()) ? '' : trimmed
}

export function normalizeRoadmap(raw) {
  const steps = (Array.isArray(raw?.steps) ? raw.steps : [])
    .map((step) => ({
      stage: cleanText(step?.stage),
      title: cleanText(step?.title),
      detail: cleanText(step?.detail),
      requirement: cleanText(step?.requirement) || null,
    }))
    .filter((step) => step.title || step.detail)

  if (!steps.length) {
    throw new Error('The roadmap came back without any steps.')
  }

  return {
    title: cleanText(raw?.title) || 'Your roadmap',
    summary: cleanText(raw?.summary),
    steps,
    examsToWatch: (Array.isArray(raw?.examsToWatch) ? raw.examsToWatch : [])
      .map(cleanText)
      .filter(Boolean),
    commonMistake: cleanText(raw?.commonMistake) || null,
  }
}

export function normalizeComparison(raw, requested) {
  const items = (Array.isArray(raw?.items) ? raw.items : [])
    .map((item, i) => ({
      name: cleanText(item?.name) || requested[i] || `Option ${i + 1}`,
      fullName: cleanText(item?.fullName),
      kind: cleanText(item?.kind).toLowerCase() || 'option',
      duration: cleanText(item?.duration) || '—',
      eligibility: cleanText(item?.eligibility) || '—',
      entranceExams: (Array.isArray(item?.entranceExams) ? item.entranceExams : [])
        .map(cleanText)
        .filter(Boolean),
      studyFocus: cleanText(item?.studyFocus) || '—',
      startingSalary: cleanText(item?.startingSalary) || '—',
      experiencedSalary: cleanText(item?.experiencedSalary) || '—',
      topRoles: (Array.isArray(item?.topRoles) ? item.topRoles : []).map(cleanText).filter(Boolean),
      higherStudies: cleanText(item?.higherStudies) || '—',
      bestFor: cleanText(item?.bestFor) || '—',
      watchOut: cleanText(item?.watchOut) || '—',
    }))
    .filter((item) => item.name)

  if (items.length < 2) {
    throw new Error('The comparison came back with too few options to compare.')
  }

  return {
    title: cleanText(raw?.title) || 'Your comparison',
    summary: cleanText(raw?.summary),
    items,
    verdict: cleanText(raw?.verdict) || null,
  }
}
