function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function relu(x: number): number {
  return Math.max(0, x);
}

function dotProduct(as: number[], bs: number[]): number {
  return as.reduce((sum, a, i) => sum + a * bs[i], 0);
}

// function meanSquaredError(outputs: number[], targets: number[]): number {
//   return (
//     outputs.reduce((sum, output, i) => sum + (output - targets[i]) ** 2, 0) /
//     outputs.length
//   );
// }

class Neuron {
  public bias: number;

  public weights: number[];

  constructor(connections: number) {
    this.bias = Math.random();
    this.weights = Array(connections).fill(0).map(Math.random);
  }

  public activate(
    inputs: number[],
    activationFunction: (x: number) => number
  ): number {
    return activationFunction(dotProduct(inputs, this.weights) + this.bias);
  }

  public adjustWeights(inputs: number[], delta: number) {
    this.weights = this.weights.map((weight, i) => weight + delta * inputs[i]);
  }

  public adjustBias(delta: number) {
    this.bias += delta;
  }
}

class NeuronLayer {
  public neurons: Neuron[];

  private activationFunction: (x: number) => number;

  constructor(
    neurons: number,
    connections: number,
    activationFunction: (x: number) => number
  ) {
    this.neurons = Array(neurons)
      .fill(0)
      .map(() => new Neuron(connections));
    this.activationFunction = activationFunction;
  }

  public activate(inputs: number[]): number[] {
    return this.neurons.map((neuron) =>
      neuron.activate(inputs, this.activationFunction)
    );
  }
}

class WellConnectedNeuronNetwork {
  public layers: NeuronLayer[];

  constructor(neuronsPerLayer: number[], connectionsForFirstLayer: number) {
    this.layers = neuronsPerLayer.map(
      (neuronsForThisLayer, index) =>
        new NeuronLayer(
          neuronsForThisLayer,
          index === 0 ? connectionsForFirstLayer : neuronsPerLayer[index - 1],
          relu
        )
    );
  }

  public activate(inputs: number[]): number[] {
    return this.layers.reduce((prev, layer) => layer.activate(prev), inputs);
  }
}

type TrainingData = {
  inputs: number[];
  targets: number[];
};

function backpropagate(
  network: WellConnectedNeuronNetwork,
  trainingData: TrainingData[]
) {
  const learningRate = 0.1;

  trainingData.forEach(({ inputs, targets }) => {
    // Forward pass
    const outputs = network.activate(inputs);

    // Backward pass
    const errorGradients: number[][] = [];
    // eslint-disable-next-line no-plusplus
    for (let i = network.layers.length - 1; i >= 0; i--) {
      const layer = network.layers[i];
      const isOutputLayer = i === network.layers.length - 1;

      // Calculate error gradients for this layer
      const gradients = layer.neurons.map((neuron, j) => {
        if (isOutputLayer) {
          return (outputs[j] - targets[j]) * outputs[j] * (1 - outputs[j]);
        }
        const downstreamGradients = errorGradients[0];
        const weights = neuron.weights.map(
          (_, k) => network.layers[i + 1].neurons[k].weights[j]
        );
        const sum = dotProduct(downstreamGradients, weights);
        return (
          neuron.activate(inputs, relu) *
          (1 - neuron.activate(inputs, relu)) *
          sum
        );
      });
      errorGradients.unshift(gradients);

      // Adjust weights and biases for this layer
      layer.neurons.forEach((neuron, j) => {
        const delta = learningRate * gradients[j];
        neuron.adjustWeights(inputs, delta);
        neuron.adjustBias(delta);
      });
    }
  });
}

const network = new WellConnectedNeuronNetwork([3, 3, 3], 3);

console.log("initial: ", network.activate([1, 2, 3]));

const trainingData: TrainingData[] = [
  { inputs: [0, 1, 2], targets: [3, 4, 5] },
];

for (let i = 0; i < 10000; i++) {
  backpropagate(network, trainingData);
}

console.log("final: ", network.activate([1, 2, 3]));
