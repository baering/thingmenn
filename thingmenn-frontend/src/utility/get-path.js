export const getLocalPath = (params) => {
  if (!params) return 'kjortimabil/allt'

  return `${params.lthing ? 'thing' : 'kjortimabil'}/${params.lthing || params.term || 'allt'}`;
}

export default (params) => `${params.lthing ? 'lthing' : 'term'}/${params.lthing || params.term || 'allt'}`;
