export function encodeChunk(
  fieldId: string,
  chunkIndex: number,
  totalChunks: number,
  chunkData: ArrayBuffer,
) {
  const HEADER_SIZE = 64;
  const buffer = new ArrayBuffer(HEADER_SIZE + chunkData.byteLength);
  const view = new DataView(buffer);
  const unit8 = new Uint8Array(buffer);

  const idBytes = new TextEncoder().encode(fieldId);
  unit8.set(idBytes, 0);

  view.setUint32(36, chunkIndex, true);
  view.setUint32(40, totalChunks, true);
  view.setUint32(44, chunkData.byteLength, true);

  unit8.set(new Uint8Array(chunkData), HEADER_SIZE);

  return buffer;
}

export function decodeChunk(buffer: ArrayBuffer) {
  const HEADER_SIZE = 64;
  const view = new DataView(buffer);
  const uint8 = new Uint8Array(buffer);

  const fileId = new TextDecoder()
    .decode(uint8.slice(0, 36))
    .replace(/\0/g, "");
  const chunkIndex = view.getUint32(36, true);
  const totalChunks = view.getUint32(40, true);
  const chunkSize = view.getUint32(44, true);
  const data = buffer.slice(HEADER_SIZE, HEADER_SIZE + chunkSize);

  return { fileId, chunkIndex, totalChunks, chunkSize, data };
}
