const path = require('path');
const createSandbox = require('./sandbox');

describe('e-show', () => {
  let sandbox;
  let root;
  let name;
  let out;

  beforeEach(() => {
    sandbox = createSandbox();
    root = path.join(sandbox.tmpdir, sandbox.randomString());
    name = sandbox.randomString();
    out = sandbox.randomString();
  });

  afterEach(() => {
    sandbox.cleanup();
  });

  it('shows the current config', () => {
    sandbox
      .eInitRunner()
      .root(root)
      .name(name)
      .run();
    const result = sandbox
      .eShowRunner()
      .current()
      .run();
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toEqual(name);
  });

  it('shows the outdir', () => {
    sandbox
      .eInitRunner()
      .root(root)
      .name(name)
      .out(out)
      .run();
    const result = sandbox
      .eShowRunner()
      .out()
      .run();
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toEqual(out);
  });

  it('shows the root', () => {
    sandbox
      .eInitRunner()
      .root(root)
      .name(name)
      .out(out)
      .run();
    const result = sandbox
      .eShowRunner()
      .root()
      .run();
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toEqual(root);
  });

  it('shows the exec', () => {
    sandbox
      .eInitRunner()
      .root(root)
      .name(name)
      .out(out)
      .run();
    const result = sandbox
      .eShowRunner()
      .exec()
      .run();
    expect(result.exitCode).toBe(0);
    const exec = result.stdout;
    expect(exec).toContain(root);
    expect(exec).toContain(out);
  });

  it('shows the src', () => {
    const srcdir = 'base';
    sandbox
      .eInitRunner()
      .root(root)
      .name(name)
      .out(out)
      .run();
    const result = sandbox
      .eShowRunner()
      .src(srcdir)
      .run();
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toEqual(path.resolve(root, 'src', srcdir));
  });

  it('shows all configs', () => {
    sandbox
      .eInitRunner()
      .root(`${root}1`)
      .name(`${name}1`)
      .out(`${out}1`)
      .run();
    sandbox
      .eInitRunner()
      .root(`${root}2`)
      .name(`${name}2`)
      .out(`${out}2`)
      .run();
    const result = sandbox
      .eShowRunner()
      .configs()
      .run();
    expect(result.exitCode).toBe(0);
    const names = result.stdout
      .split('\n')
      .map(line => (line.startsWith('* ') ? line.slice(2) : line));
    expect(names).toEqual([`${name}1`, `${name}2`]);
  });

  it('shows env', () => {
    sandbox
      .eInitRunner()
      .root(root)
      .name(name)
      .out(out)
      .run();
    const result = sandbox
      .eShowRunner()
      .env()
      .run();
    expect(result.exitCode).toBe(0);
    const env = result.stdout
      .split('\n')
      .map(line => line.slice('export '.length).split('=', 2))
      .reduce((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {});
    expect(Object.keys(env).sort()).toEqual(
      expect.arrayContaining(['CHROMIUM_BUILDTOOLS_PATH', 'GIT_CACHE_PATH']),
    );
  });
});
