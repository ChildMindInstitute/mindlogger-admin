type MessageListener = (event: { data: unknown }) => void;

const openChannels = new Map<string, Set<InMemoryBroadcastChannel>>();

// Stands in for BroadcastChannel, which jsdom does not implement. Delivery is synchronous so tests
// can assert without awaiting, and never reaches the sender, as in the real API.
export class InMemoryBroadcastChannel {
  onmessage: MessageListener | null = null;

  private isClosed = false;

  constructor(readonly name: string) {
    const peers = openChannels.get(name) ?? new Set<InMemoryBroadcastChannel>();
    peers.add(this);
    openChannels.set(name, peers);
  }

  postMessage(data: unknown) {
    if (this.isClosed) throw new Error('postMessage on a closed InMemoryBroadcastChannel');

    openChannels.get(this.name)?.forEach((peer) => {
      if (peer !== this) peer.onmessage?.({ data });
    });
  }

  close() {
    this.isClosed = true;
    openChannels.get(this.name)?.delete(this);
  }
}

export const resetInMemoryBroadcastChannels = () => openChannels.clear();
