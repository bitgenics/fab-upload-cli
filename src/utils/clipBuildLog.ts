export default function clipBuildLog(log: string, byteLimit: number): string {
  const buf = Buffer.from(log);
  if (buf.byteLength > byteLimit) {
    const message = Buffer.from(
      `\n\n---- ✂️ LOG CLIPPED ~ fab-upload-cli ✂️ ----\n\n`
    );
    const messageByteLength = message.byteLength;
    const subA = buf.slice(0, byteLimit / 2 - messageByteLength / 2);
    const subB = buf.slice(
      buf.byteLength - byteLimit / 2 + messageByteLength / 2,
      buf.byteLength
    );
    const joined = Buffer.concat([subA, message, subB]);
    return joined.toString();
  } else {
    return log;
  }
};