let context = null;

export function playSound(buffer, time = 0) {
  const source = context.context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.context.destination);
  source.start(time);
};

export function setContext(ctx) {
  context = ctx;
}
