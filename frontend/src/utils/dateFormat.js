// Compatibility shim: some components import '../../utils/dateFormat' but the
// file in this project is accidentally named `dateFormate.js` (typo).
// Re-export the correctly named export here so imports continue to work.
export { dateFormat } from './dateFormate'
