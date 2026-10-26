import { vi } from "vitest";

export class MockAudioNode {
  connectedTo: any[] = [];
  connect = vi.fn((node: any) => {
    this.connectedTo.push(node);
    return node;
  });
  disconnect = vi.fn((node?: any) => {
    if (node) {
      this.connectedTo = this.connectedTo.filter(n => n !== node);
    } else {
      this.connectedTo = [];
    }
  });
}

export class MockAudioParam {
  value = 0;
  setValueAtTime = vi.fn((val: number) => {
    this.value = val;
  });
  setTargetAtTime = vi.fn((val: number) => {
    this.value = val;
  });
}

export class MockBiquadFilterNode extends MockAudioNode {
  type: string = "peaking";
  frequency = new MockAudioParam();
  Q = new MockAudioParam();
  gain = new MockAudioParam();
}

export class MockDynamicsCompressorNode extends MockAudioNode {
  threshold = new MockAudioParam();
  knee = new MockAudioParam();
  ratio = new MockAudioParam();
  attack = new MockAudioParam();
  release = new MockAudioParam();
}

export class MockAudioContext {
  currentTime = 0;
  state: "running" | "suspended" = "running";
  destination = new MockAudioNode();
  resume = vi.fn(async () => {
    this.state = "running";
  });
  createBiquadFilter = vi.fn(() => new MockBiquadFilterNode());
  createDynamicsCompressor = vi.fn(() => new MockDynamicsCompressorNode());
  createMediaElementSource = vi.fn((_el: any) => new MockAudioNode());
}
