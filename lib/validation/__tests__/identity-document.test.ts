import { expect, it } from 'vitest'
import { identityDocumentError, identityDocumentMatchesType, MAX_IDENTITY_DOCUMENT_BYTES } from '../identity-document'
it('validates photo type and size', () => {
  expect(identityDocumentError(null)).toBeTruthy()
  expect(identityDocumentError(new File([], 'empty.jpg', { type: 'image/jpeg' }))).toBeTruthy()
  expect(identityDocumentError(new File(['data'], 'id.pdf', { type: 'application/pdf' }))).toBeTruthy()
  expect(identityDocumentError(new File([new Uint8Array(MAX_IDENTITY_DOCUMENT_BYTES + 1)], 'id.jpg', { type: 'image/jpeg' }))).toBeTruthy()
  expect(identityDocumentError(new File(['data'], 'id.jpg', { type: 'image/jpeg' }))).toBeNull()
})
it('checks image signatures rather than trusting extension or MIME', () => {
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff])
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  expect(identityDocumentMatchesType(jpeg, 'image/jpeg')).toBe(true)
  expect(identityDocumentMatchesType(png, 'image/png')).toBe(true)
  expect(identityDocumentMatchesType(png, 'image/jpeg')).toBe(false)
  expect(identityDocumentMatchesType(new Uint8Array(), 'image/jpeg')).toBe(false)
})
