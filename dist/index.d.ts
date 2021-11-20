type Props = {
  id?: string
  accept?: string
  capture?: string
  multiple?: boolean
  handleChange: (arg0: Return) => void
  maxFileSize: number
  thumbnail_size: number
  drop: boolean
  dropText: string
}

type Date = {
  fileName?: string
  ofileData?: string
  fileData?: string
  ofileSize?: number
  fileSize?: number
  fileType?: string
}

type Result = {
  result: boolean
  messages: string[]
  data: Data
}
/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document or document body is not
 * yet defined.
 *
 * @param {?Document} doc Defaults to current document.
 * @return {Element | null}
 * @see https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/dom/getActiveElement.js
 */
export declare function ImageFile(props?: Props): Result
