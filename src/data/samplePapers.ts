export interface PaperMetadata {
  title: string;
  authors: string[];
  year: string;
  venueOrArxiv: string;
  githubUrl: string;
  tags: string[];
}

export interface CoreConcept {
  problemStatement: string;
  primaryMethodology: string;
  mathematicalAlgorithmicBreakthroughs: string;
  accessibleSummary: string;
  wordCount: number;
  calculatedWordCount?: number;
  underWordLimit?: boolean;
}

export interface NodeExplanation {
  node: string;
  description: string;
}

export interface FlowchartData {
  mermaidCode: string;
  nodeExplanations: NodeExplanation[];
}

export interface StudentProject {
  id: number;
  title: string;
  exactExtension: string;
  targetedPerformanceMetric: string;
  recommendedTechStack: string[];
  difficulty: 'Beginner-Friendly' | 'Intermediate (3rd-Year CS)' | 'Advanced';
  estimatedWeeks: number;
  benchmarkDataset: string;
  resumeBulletPoint: string;
  implementationSteps: string[];
}

export interface AnalysisResult {
  paperMetadata: PaperMetadata;
  coreConcept: CoreConcept;
  flowchart: FlowchartData;
  studentProjects: StudentProject[];
  rawAgentOutput: string;
}

export interface TokenMetrics {
  promptTokens: number;
  candidateTokens: number;
  totalTokens: number;
  budgetLimit: number;
  budgetUsedPercent: number;
  efficiencyStatus: 'OPTIMAL' | 'EFFICIENT' | 'WARNING';
}

export const PRESET_PAPERS: {
  id: string;
  title: string;
  arxivId: string;
  url: string;
  badge: string;
  data: AnalysisResult;
  tokenMetrics: TokenMetrics;
}[] = [
  {
    id: 'mamba',
    title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    arxivId: '2312.00752',
    url: 'https://arxiv.org/abs/2312.00752',
    badge: 'State Space Models',
    tokenMetrics: {
      promptTokens: 1420,
      candidateTokens: 1890,
      totalTokens: 3310,
      budgetLimit: 25000,
      budgetUsedPercent: 13,
      efficiencyStatus: 'OPTIMAL',
    },
    data: {
      paperMetadata: {
        title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
        authors: ['Albert Gu', 'Tri Dao'],
        year: '2023',
        venueOrArxiv: 'arXiv:2312.00752 (CoRR)',
        githubUrl: 'https://github.com/state-spaces/mamba',
        tags: ['Linear Attention', 'Selective SSM', 'Hardware Awareness', 'Sequence Modeling'],
      },
      coreConcept: {
        problemStatement:
          'Standard Transformers suffer from quadratic computational complexity O(N^2) in sequence length, creating prohibitive memory bottlenecks during long-context inference. While prior State Space Models (SSMs) offered linear O(N) scaling, their time-invariant matrices prevented dynamic content-based reasoning.',
        primaryMethodology:
          'Mamba introduces Selective State Spaces (S6) where transition matrices (B, C, and delta) are dynamic functions of the input token at each step. To execute this selection efficiently without exploding GPU memory, it pairs the algorithm with a hardware-aware flash-scan kernel in fast GPU SRAM.',
        mathematicalAlgorithmicBreakthroughs:
          'By parameterizing state-transition delta(x), B(x), and C(x) dynamically, Mamba overcomes linear time invariance (LTI) limitations. The recurrent discretization (A_bar = exp(delta * A)) is computed via parallel associative scans directly in high-speed SRAM, eliminating costly high-bandwidth memory (HBM) read/writes.',
        accessibleSummary:
          'Transformers are powerful because they attend to every token, but their memory explodes with long documents. Mamba solves this by upgrading classical control-theory State Space Models to selectively remember or forget information token-by-token. By computing these selective updates using parallel GPU hardware-aware scans, Mamba delivers 5x faster inference and linear scaling while matching Transformer quality.',
        wordCount: 198,
      },
      flowchart: {
        mermaidCode: `graph TD
  Input["Input Sequence X (B, L, D)"] --> Projection["Linear Projection (Expanded Dimension E)"]
  Projection --> Conv1D["1D Causal Convolution (kernel=4)"]
  Conv1D --> SiLU["SiLU Activation Function"]
  SiLU --> SSM_Block["Selective SSM (S6 Parameter Discretization)"]
  
  subgraph SSM_Core ["Hardware-Aware SRAM Parallel Scan"]
    SSM_Block --> ParamGen["Input-Dependent B(x), C(x), Delta(x)"]
    ParamGen --> Discretize["Discretize A_bar = exp(Delta * A)"]
    Discretize --> AssociativeScan["Parallel Associative Prefix Scan"]
  end
  
  AssociativeScan --> Gating["Multiplicative Gating Branch (SiLU)"]
  Gating --> OutProj["Output Linear Projection (D)"]
  OutProj --> FinalOutput["Final Output Representation (B, L, D)"]`,
        nodeExplanations: [
          { node: 'Input Sequence X', description: 'Batch of token embeddings with sequence length L and model dimension D.' },
          { node: '1D Causal Convolution', description: 'Captures local token dependencies before global state space accumulation.' },
          { node: 'Selective SSM (S6)', description: 'Selectively filters information dynamically based on the current token.' },
          { node: 'Hardware-Aware SRAM Scan', description: 'Fuses state transitions into fast GPU SRAM to avoid memory bandwidth bottlenecks.' },
          { node: 'Multiplicative Gating', description: 'Modulates SSM output against an input-derived gating signal.' },
        ],
      },
      studentProjects: [
        {
          id: 1,
          title: 'EdgeMamba: INT8 Quantized SSM for Low-Power Edge Devices',
          exactExtension:
            'Implement post-training INT8 quantization and operator fusion for Mamba selective scan kernels targeting ARM Cortex and Raspberry Pi 5 CPUs.',
          targetedPerformanceMetric:
            '3.8x reduction in memory footprint and 2.4x speedup in token generation latency on Raspberry Pi 5 with less than 1.1% increase in perplexity.',
          recommendedTechStack: ['PyTorch', 'ONNX Runtime', 'C++ / ARM NEON', 'Torch-TensorRT'],
          difficulty: 'Intermediate (3rd-Year CS)',
          estimatedWeeks: 4,
          benchmarkDataset: 'Wikitext-103 and TinyStories',
          resumeBulletPoint:
            'Engineered EdgeMamba via INT8 weight quantization and custom ARM NEON scan kernels, shrinking model size by 75% and accelerating edge inference by 2.4x.',
          implementationSteps: [
            'Profile Mamba layer bottlenecks across CPU architectures using PyTorch benchmark tools.',
            'Apply post-training quantization to linear projections and evaluate sensitivity of the selective delta parameter.',
            'Export quantized operators to ONNX Runtime and benchmark inference latency against LLaMA-7B INT8.',
            'Publish an interactive CLI demo and reproducible benchmark suite on GitHub.',
          ],
        },
        {
          id: 2,
          title: 'Hybrid Mamba-Transformer Architecture for Code Autocompletion',
          exactExtension:
            'Interleave Mamba SSM blocks with periodic Multi-Head Attention layers (3:1 ratio) to combine infinite context caching with exact syntax retrieval.',
          targetedPerformanceMetric:
            'Maintain 99.4% of full Transformer HumanEval pass@1 accuracy while slashing KV-cache RAM usage by 68% during 16k context repo completion.',
          recommendedTechStack: ['PyTorch', 'Hugging Face Transformers', 'FlashAttention-2', 'Weights & Biases'],
          difficulty: 'Intermediate (3rd-Year CS)',
          estimatedWeeks: 4,
          benchmarkDataset: 'HumanEval and StarCoder Synthetic Repos',
          resumeBulletPoint:
            'Architected a hybrid Mamba-Transformer model in PyTorch for code completion, slashing KV-cache memory by 68% across 16k token contexts.',
          implementationSteps: [
            'Construct a modular PyTorch model subclassing PreTrainedModel with alternating Mamba and Attention blocks.',
            'Fine-tune on Python code snippets using LoRA adapters to assess syntax retention.',
            'Measure memory savings during long-sequence generation using PyTorch CUDA memory profiler.',
            'Deploy demo web app with token-by-token streaming response.',
          ],
        },
        {
          id: 3,
          title: 'VisionMamba-Lite: High-Throughput Satellite Image Segmentation',
          exactExtension:
            'Adapt 2D bidirectional Selective State Spaces for dense semantic segmentation of high-resolution satellite imagery on a single consumer GPU (RTX 3060).',
          targetedPerformanceMetric:
            'Achieve 45 FPS inference at 1024x1024 resolution with an mIoU of 74.2%, outperforming SegFormer in memory efficiency.',
          recommendedTechStack: ['PyTorch', 'Albumentations', 'TorchVision', 'ONNX'],
          difficulty: 'Advanced',
          estimatedWeeks: 5,
          benchmarkDataset: 'Massachusetts Roads and Buildings Dataset',
          resumeBulletPoint:
            'Formulated VisionMamba-Lite for real-time satellite segmentation, achieving 45 FPS on 1024x1024 tiles while consuming 52% less GPU VRAM.',
          implementationSteps: [
            'Implement 2D cross-scan traversal to serialize 2D patches into 4-way selective state sequences.',
            'Attach a lightweight U-Net style decoder for dense pixel prediction.',
            'Train on 1024x1024 tiles using PyTorch Lightning with mixed precision (FP16).',
            'Benchmark latency against UNet and SegFormer on consumer GPU hardware.',
          ],
        },
      ],
      rawAgentOutput: `1. CORE CONCEPT EXTRACTION:
Problem: Standard Transformers suffer from quadratic computational complexity O(N^2) in sequence length, creating prohibitive memory bottlenecks during long-context inference. While prior State Space Models (SSMs) offered linear O(N) scaling, their time-invariant matrices prevented dynamic content-based reasoning.
Methodology: Mamba introduces Selective State Spaces (S6) where transition matrices (B, C, and delta) are dynamic functions of the input token at each step. To execute this selection efficiently without exploding GPU memory, it pairs the algorithm with a hardware-aware flash-scan kernel in fast GPU SRAM.
Breakthroughs: By parameterizing state-transition delta(x), B(x), and C(x) dynamically, Mamba overcomes linear time invariance (LTI) limitations. The recurrent discretization (A_bar = exp(delta * A)) is computed via parallel associative scans directly in high-speed SRAM, eliminating costly high-bandwidth memory (HBM) read/writes.

2. ARCHITECTURAL FLOWCHART (Mermaid.js):
[FLOWCHART]
graph TD
  Input["Input Sequence X (B, L, D)"] --> Projection["Linear Projection (Expanded Dimension E)"]
  Projection --> Conv1D["1D Causal Convolution (kernel=4)"]
  Conv1D --> SiLU["SiLU Activation Function"]
  SiLU --> SSM_Block["Selective SSM (S6 Parameter Discretization)"]
  
  subgraph SSM_Core ["Hardware-Aware SRAM Parallel Scan"]
    SSM_Block --> ParamGen["Input-Dependent B(x), C(x), Delta(x)"]
    ParamGen --> Discretize["Discretize A_bar = exp(Delta * A)"]
    Discretize --> AssociativeScan["Parallel Associative Prefix Scan"]
  end
  
  AssociativeScan --> Gating["Multiplicative Gating Branch (SiLU)"]
  Gating --> OutProj["Output Linear Projection (D)"]
  OutProj --> FinalOutput["Final Output Representation (B, L, D)"]

3. FUTURE WORK & INTERNSHIP OPPORTUNITIES:
• EdgeMamba: INT8 Quantized SSM for Low-Power Edge Devices
  Metric: 3.8x reduction in memory footprint and 2.4x speedup in token generation latency on Raspberry Pi 5 with less than 1.1% increase in perplexity.
  Tech Stack: PyTorch, ONNX Runtime, C++ / ARM NEON, Torch-TensorRT

• Hybrid Mamba-Transformer Architecture for Code Autocompletion
  Metric: Maintain 99.4% of full Transformer HumanEval pass@1 accuracy while slashing KV-cache RAM usage by 68% during 16k context repo completion.
  Tech Stack: PyTorch, Hugging Face Transformers, FlashAttention-2, Weights & Biases

• VisionMamba-Lite: High-Throughput Satellite Image Segmentation
  Metric: Achieve 45 FPS inference at 1024x1024 resolution with an mIoU of 74.2%, outperforming SegFormer in memory efficiency.
  Tech Stack: PyTorch, Albumentations, TorchVision, ONNX`,
    },
  },
  {
    id: 'attention',
    title: 'Attention Is All You Need',
    arxivId: '1706.03762',
    url: 'https://arxiv.org/abs/1706.03762',
    badge: 'Foundational Architecture',
    tokenMetrics: {
      promptTokens: 1100,
      candidateTokens: 1650,
      totalTokens: 2750,
      budgetLimit: 25000,
      budgetUsedPercent: 11,
      efficiencyStatus: 'OPTIMAL',
    },
    data: {
      paperMetadata: {
        title: 'Attention Is All You Need',
        authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Lukasz Kaiser', 'Illia Polosukhin'],
        year: '2017',
        venueOrArxiv: 'NeurIPS 2017 / arXiv:1706.03762',
        githubUrl: 'https://github.com/tensorflow/tensor2tensor',
        tags: ['Transformer', 'Self-Attention', 'Sequence-to-Sequence', 'NLP Foundation'],
      },
      coreConcept: {
        problemStatement:
          'Recurrent Neural Networks (RNNs) and LSTMs compute sequentially along symbol positions, precluding parallelization within training examples and struggling to retain long-range dependencies across distant sequence tokens.',
        primaryMethodology:
          'The authors discarded recurrence and convolutions entirely, introducing the Transformer: an encoder-decoder architecture based solely on Multi-Head Self-Attention to compute representations of input and output without regard to distance.',
        mathematicalAlgorithmicBreakthroughs:
          'Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V. Multi-head projection allows the model to jointly attend to information from different representation subspaces at different positions, combined with sinusoidal positional encodings.',
        accessibleSummary:
          'Instead of processing text one word after another like older sequential networks, the Transformer analyzes the relationship between every word in a sentence all at once. By replacing step-by-step loops with parallel matrix multiplications and self-attention, it unlocked massive speedups on modern GPU hardware and laid the bedrock for all modern Large Language Models.',
        wordCount: 184,
      },
      flowchart: {
        mermaidCode: `graph TD
  Inputs["Inputs & Targets"] --> Embeddings["Token Embedding + Sinusoidal Positional Encoding"]
  
  subgraph EncoderStack ["Encoder Block (Nx)"]
    Embeddings --> MultiHeadAttn["Multi-Head Self-Attention"]
    MultiHeadAttn --> AddNorm1["Add & LayerNorm"]
    AddNorm1 --> FeedForward["Feed-Forward Network (ReLU)"]
    FeedForward --> AddNorm2["Add & LayerNorm"]
  end
  
  subgraph DecoderStack ["Decoder Block (Nx)"]
    Targets["Target Tokens"] --> MaskedAttn["Masked Multi-Head Attention"]
    MaskedAttn --> DecAddNorm1["Add & LayerNorm"]
    DecAddNorm1 --> CrossAttn["Encoder-Decoder Cross-Attention"]
    AddNorm2 -.-> CrossAttn
    CrossAttn --> DecAddNorm2["Add & LayerNorm"]
    DecAddNorm2 --> DecFFN["Feed-Forward Network"]
    DecFFN --> DecAddNorm3["Add & LayerNorm"]
  end
  
  DecAddNorm3 --> LinearOutput["Linear Projection & Softmax"]
  LinearOutput --> OutputProb["Output Token Probabilities"]`,
        nodeExplanations: [
          { node: 'Sinusoidal Positional Encoding', description: 'Injects sequence order into parallel computations using sine and cosine frequencies.' },
          { node: 'Multi-Head Self-Attention', description: 'Projects queries, keys, and values into multiple subspaces to attend across positions.' },
          { node: 'Add & LayerNorm', description: 'Residual connections and normalization stabilizing deep gradient propagation.' },
          { node: 'Masked Attention', description: 'Prevents positions from attending to subsequent future tokens during autoregressive decoding.' },
        ],
      },
      studentProjects: [
        {
          id: 1,
          title: 'MicroTransformer: From Scratch PyTorch Implementation & Visual Attention Head Explorer',
          exactExtension:
            'Build a bare-metal PyTorch Transformer from mathematical first principles with an interactive Streamlit visualization dashboard tracking attention head entropy and token routing across layers.',
          targetedPerformanceMetric:
            'Achieve 99.8% numerical parity with torch.nn.Transformer while profiling self-attention memory overhead across sequence lengths up to 8192 tokens.',
          recommendedTechStack: ['PyTorch', 'Streamlit', 'Weights & Biases', 'Plotly'],
          difficulty: 'Beginner-Friendly',
          estimatedWeeks: 3,
          benchmarkDataset: 'Shakespeare Character-Level & Multi30k Translation',
          resumeBulletPoint:
            'Engineered a Transformer architecture from scratch in pure PyTorch; developed a Streamlit inspection tool visualizing dynamic attention entropy across 8 heads.',
          implementationSteps: [
            'Implement Scaled Dot-Product Attention, MultiHeadAttention, and Positional Encodings without using high-level torch.nn modules.',
            'Train a miniature sequence-to-sequence translation model on Multi30k dataset.',
            'Compute attention matrix distributions and render interactive heatmaps.',
            'Deploy visualization web app for educational demonstrations.',
          ],
        },
        {
          id: 2,
          title: 'FlashLinear-Transformer: Matrix-Decomposition Attention for Edge NLP',
          exactExtension:
            'Substitute the softmax(QK^T) kernel with low-rank kernel approximation (Performer / CosFormer) combined with INT8 quantization for sub-quadratic sequence translation.',
          targetedPerformanceMetric:
            'Slash training VRAM by 55% on sequences longer than 4096 tokens with less than 0.8 BLEU point drop on WMT 2014 En-De.',
          recommendedTechStack: ['PyTorch', 'Hugging Face Transformers', 'Triton', 'ONNX Runtime'],
          difficulty: 'Intermediate (3rd-Year CS)',
          estimatedWeeks: 4,
          benchmarkDataset: 'WMT 2014 English-to-German & Long Range Arena',
          resumeBulletPoint:
            'Built FlashLinear-Transformer combining low-rank kernel attention with INT8 quantization, reducing peak GPU VRAM by 55% on long sequences.',
          implementationSteps: [
            'Formulate kernel feature maps to compute K^T * V prior to Q projection, achieving O(N) complexity.',
            'Benchmark throughput against standard FlashAttention on synthetic benchmarks.',
            'Fine-tune on WMT En-De dataset and evaluate translation BLEU scores.',
            'Export ONNX runtime graphs for mobile CPU benchmarks.',
          ],
        },
        {
          id: 3,
          title: 'Sparse-Prune Attention: Dynamic Head Dropping for Low-Latency Serving',
          exactExtension:
            'Develop a differentiable gate mechanism to prune redundant attention heads dynamically during inference based on input perplexity.',
          targetedPerformanceMetric:
            'Eliminate 40% of attention heads during run-time inference, yielding a 1.7x latency speedup with < 1% task degradation.',
          recommendedTechStack: ['PyTorch', 'TensorRT-LLM', 'Hugging Face Accelerate'],
          difficulty: 'Advanced',
          estimatedWeeks: 5,
          benchmarkDataset: 'GLUE Benchmark & SQuAD 2.0',
          resumeBulletPoint:
            'Designed a differentiable head-pruning module in PyTorch, accelerating inference by 1.7x through dynamic removal of 40% of attention heads.',
          implementationSteps: [
            'Add learnable L0 regularization gates to each attention head in the encoder.',
            'Train with scheduled sparsity penalties on the GLUE benchmark.',
            'Evaluate inference throughput with TorchScript JIT compilation.',
            'Author an empirical report comparing pruned heads across semantic tasks.',
          ],
        },
      ],
      rawAgentOutput: `1. CORE CONCEPT EXTRACTION:
Problem: Recurrent Neural Networks (RNNs) and LSTMs compute sequentially along symbol positions, precluding parallelization within training examples and struggling to retain long-range dependencies across distant sequence tokens.
Methodology: The authors discarded recurrence and convolutions entirely, introducing the Transformer: an encoder-decoder architecture based solely on Multi-Head Self-Attention to compute representations of input and output without regard to distance.
Breakthroughs: Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V. Multi-head projection allows the model to jointly attend to information from different representation subspaces at different positions, combined with sinusoidal positional encodings.

2. ARCHITECTURAL FLOWCHART (Mermaid.js):
[FLOWCHART]
graph TD
  Inputs["Inputs & Targets"] --> Embeddings["Token Embedding + Sinusoidal Positional Encoding"]
  Embeddings --> MultiHeadAttn["Multi-Head Self-Attention"]
  MultiHeadAttn --> AddNorm1["Add & LayerNorm"]
  AddNorm1 --> FeedForward["Feed-Forward Network (ReLU)"]
  FeedForward --> AddNorm2["Add & LayerNorm"]
  FeedForward --> OutputProb["Output Token Probabilities"]

3. FUTURE WORK & INTERNSHIP OPPORTUNITIES:
• MicroTransformer: From Scratch PyTorch Implementation & Visual Attention Head Explorer
  Metric: Achieve 99.8% numerical parity with torch.nn.Transformer while profiling self-attention memory overhead across sequence lengths up to 8192 tokens.
  Tech Stack: PyTorch, Streamlit, Weights & Biases, Plotly

• FlashLinear-Transformer: Matrix-Decomposition Attention for Edge NLP
  Metric: Slash training VRAM by 55% on sequences longer than 4096 tokens with less than 0.8 BLEU point drop on WMT 2014 En-De.
  Tech Stack: PyTorch, Hugging Face Transformers, Triton, ONNX Runtime

• Sparse-Prune Attention: Dynamic Head Dropping for Low-Latency Serving
  Metric: Eliminate 40% of attention heads during run-time inference, yielding a 1.7x latency speedup with < 1% task degradation.
  Tech Stack: PyTorch, TensorRT-LLM, Hugging Face Accelerate`,
    },
  },
  {
    id: 'dpo',
    title: 'Direct Preference Optimization (DPO)',
    arxivId: '2305.18290',
    url: 'https://arxiv.org/abs/2305.18290',
    badge: 'RLHF Alignment',
    tokenMetrics: {
      promptTokens: 1250,
      candidateTokens: 1720,
      totalTokens: 2970,
      budgetLimit: 25000,
      budgetUsedPercent: 12,
      efficiencyStatus: 'OPTIMAL',
    },
    data: {
      paperMetadata: {
        title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model',
        authors: ['Rafael Rafailov', 'Archit Sharma', 'Eric Mitchell', 'Stefano Ermon', 'Christopher D. Manning', 'Chelsea Finn'],
        year: '2023',
        venueOrArxiv: 'NeurIPS 2023 / arXiv:2305.18290',
        githubUrl: 'https://github.com/eric-mitchell/direct-preference-optimization',
        tags: ['RLHF', 'Alignment', 'Policy Optimization', 'LLMs'],
      },
      coreConcept: {
        problemStatement:
          'Reinforcement Learning from Human Feedback (RLHF) with PPO is notoriously unstable, computationally expensive, and fragile, requiring fitting a separate reward model and sampling from the policy during training loop iterations.',
        primaryMethodology:
          'DPO mathematically re-parameterizes the reward function directly in terms of the language model policy itself. This transforms the complex reinforcement learning optimization problem into a simple, closed-form binary cross-entropy loss over preferred versus dispreferred completion pairs.',
        mathematicalAlgorithmicBreakthroughs:
          'Exact closed-form equivalence: r(x, y) = beta * log(pi_theta(y|x) / pi_ref(y|x)). The Bradley-Terry preference objective is formulated directly without an external reward network: L_DPO = -E[log sigma(beta * log(pi_theta(y_w|x)/pi_ref(y_w|x)) - beta * log(pi_theta(y_l|x)/pi_ref(y_l|x)))].',
        accessibleSummary:
          'Traditional AI alignment required training two separate AI systems: a reward model that judges answers, and a language model that guesses answers while an unstable RL algorithm adjusts it. DPO proved mathematically that the language model itself can act directly as its own reward model. This eliminates reinforcement learning entirely, aligning models with simple classification loss on paired data.',
        wordCount: 191,
      },
      flowchart: {
        mermaidCode: `graph TD
  Prompt["User Prompt x"] --> Dataset["Preference Pair: Preferred (y_w) & Dispreferred (y_l)"]
  Dataset --> RefModel["Frozen Reference Model (pi_ref)"]
  Dataset --> PolicyModel["Active Policy Model (pi_theta)"]
  
  RefModel --> LogProbRefW["Compute Log-Prob: log pi_ref(y_w|x)"]
  RefModel --> LogProbRefL["Compute Log-Prob: log pi_ref(y_l|x)"]
  
  PolicyModel --> LogProbPolW["Compute Log-Prob: log pi_theta(y_w|x)"]
  PolicyModel --> LogProbPolL["Compute Log-Prob: log pi_theta(y_l|x)"]
  
  LogProbRefW & LogProbPolW --> ImplicitRewW["Implicit Reward Delta: r_theta(x, y_w)"]
  LogProbRefL & LogProbPolL --> ImplicitRewL["Implicit Reward Delta: r_theta(x, y_l)"]
  
  ImplicitRewW & ImplicitRewL --> DPOLoss["DPO Binary Cross-Entropy Loss"]
  DPOLoss --> Backprop["Backward Pass & Optimizer Step on Policy pi_theta"]`,
        nodeExplanations: [
          { node: 'Frozen Reference Model (pi_ref)', description: 'Prevents the active policy from drifting too far from original conversational quality.' },
          { node: 'Active Policy Model (pi_theta)', description: 'The weights being optimized to favor preferred answers over dispreferred ones.' },
          { node: 'Implicit Reward Delta', description: 'Computes log-ratio reward directly without a separate reward neural network.' },
          { node: 'DPO Binary Cross-Entropy', description: 'Maximizes margin between preferred completion y_w and dispreferred completion y_l.' },
        ],
      },
      studentProjects: [
        {
          id: 1,
          title: 'QLoRA-DPO: Consumer-GPU LLM Alignment on Single 8GB VRAM Card',
          exactExtension:
            'Implement 4-bit NF4 quantized base models paired with low-rank adaptation for the reference and policy models, enabling full DPO alignment on a single RTX 3070 (8GB VRAM).',
          targetedPerformanceMetric:
            'Reduce training memory by 72% (from 24GB to 6.8GB VRAM) while achieving an 84% win-rate against the SFT baseline on AlpacaEval.',
          recommendedTechStack: ['PyTorch', 'bitsandbytes', 'Hugging Face TRL', 'PEFT'],
          difficulty: 'Intermediate (3rd-Year CS)',
          estimatedWeeks: 4,
          benchmarkDataset: 'Anthropic HH-RLHF & UltraFeedback',
          resumeBulletPoint:
            'Implemented QLoRA-DPO alignment pipeline in PyTorch & TRL; trained aligned 7B parameter LLMs on a single 8GB consumer GPU, cutting memory by 72%.',
          implementationSteps: [
            'Set up 4-bit base model loading with bitsandbytes NF4 precision.',
            'Configure PEFT LoRA adapters shared across policy and frozen reference evaluation.',
            'Fine-tune on Anthropic HH-RLHF dataset with Hugging Face TRL DPOTrainer.',
            'Conduct automated win-rate evaluation using GPT-4 / AlpacaEval benchmark script.',
          ],
        },
        {
          id: 2,
          title: 'Confidence-Weighted DPO: Noise-Resilient Human Preference Learning',
          exactExtension:
            'Formulate a margin-weighted loss modifying the beta parameter dynamically based on annotator agreement and token perplexity confidence.',
          targetedPerformanceMetric:
            'Increase alignment stability on noisy crowd-sourced preference data by 22% with 0% policy collapse.',
          recommendedTechStack: ['PyTorch', 'Hugging Face Datasets', 'Scikit-learn', 'W&B'],
          difficulty: 'Intermediate (3rd-Year CS)',
          estimatedWeeks: 4,
          benchmarkDataset: 'OpenAssistant Conversations & Synthetic Label Noise Benchmark',
          resumeBulletPoint:
            'Formulated confidence-weighted DPO algorithm in PyTorch; boosted alignment robustness by 22% on noisy datasets with zero policy collapse.',
          implementationSteps: [
            'Inject synthetic label flip noise (10%, 20%, 30%) into preference datasets.',
            'Implement dynamic temperature scaling based on sequence-level perplexity variance.',
            'Benchmark convergence stability against vanilla DPO and KTO algorithms.',
            'Draft empirical analysis paper with ablation graphs.',
          ],
        },
        {
          id: 3,
          title: 'Code-DPO: Reinforcement-Free Alignment for Unit Test Passing',
          exactExtension:
            'Construct automated code execution preference pairs where preferred answers pass all unit tests and dispreferred answers fail edge cases.',
          targetedPerformanceMetric:
            'Improve HumanEval pass@1 from 38% to 54% on a 3B parameter model without costly online execution in the training loop.',
          recommendedTechStack: ['PyTorch', 'PyTest', 'Docker Sandbox', 'vLLM'],
          difficulty: 'Advanced',
          estimatedWeeks: 5,
          benchmarkDataset: 'MBPP (Mostly Basic Python Problems) & HumanEval',
          resumeBulletPoint:
            'Engineered automated Code-DPO framework with sandboxed test execution, lifting 3B code model pass@1 by 16 percentage points.',
          implementationSteps: [
            'Build safe Dockerized execution harness to generate unit test verification pairs.',
            'Curate 10,000 coding challenge pairs with execution logs.',
            'Align model using DPO with test-coverage weighted loss.',
            'Benchmark across HumanEval and LeetCode test suites.',
          ],
        },
      ],
      rawAgentOutput: `1. CORE CONCEPT EXTRACTION:
Problem: Reinforcement Learning from Human Feedback (RLHF) with PPO is notoriously unstable, computationally expensive, and fragile, requiring fitting a separate reward model and sampling from the policy during training loop iterations.
Methodology: DPO mathematically re-parameterizes the reward function directly in terms of the language model policy itself. This transforms the complex reinforcement learning optimization problem into a simple, closed-form binary cross-entropy loss over preferred versus dispreferred completion pairs.
Breakthroughs: Exact closed-form equivalence: r(x, y) = beta * log(pi_theta(y|x) / pi_ref(y|x)). The Bradley-Terry preference objective is formulated directly without an external reward network: L_DPO = -E[log sigma(beta * log(pi_theta(y_w|x)/pi_ref(y_w|x)) - beta * log(pi_theta(y_l|x)/pi_ref(y_l|x)))].

2. ARCHITECTURAL FLOWCHART (Mermaid.js):
[FLOWCHART]
graph TD
  Prompt["User Prompt x"] --> Dataset["Preference Pair: Preferred (y_w) & Dispreferred (y_l)"]
  Dataset --> RefModel["Frozen Reference Model (pi_ref)"]
  Dataset --> PolicyModel["Active Policy Model (pi_theta)"]
  RefModel --> LogProbRefW["Compute Log-Prob: log pi_ref(y_w|x)"]
  RefModel --> LogProbRefL["Compute Log-Prob: log pi_ref(y_l|x)"]
  PolicyModel --> LogProbPolW["Compute Log-Prob: log pi_theta(y_w|x)"]
  PolicyModel --> LogProbPolL["Compute Log-Prob: log pi_theta(y_l|x)"]
  LogProbRefW & LogProbPolW --> ImplicitRewW["Implicit Reward Delta: r_theta(x, y_w)"]
  LogProbRefL & LogProbPolL --> ImplicitRewL["Implicit Reward Delta: r_theta(x, y_l)"]
  ImplicitRewW & ImplicitRewL --> DPOLoss["DPO Binary Cross-Entropy Loss"]
  DPOLoss --> Backprop["Backward Pass & Optimizer Step on Policy pi_theta"]

3. FUTURE WORK & INTERNSHIP OPPORTUNITIES:
• QLoRA-DPO: Consumer-GPU LLM Alignment on Single 8GB VRAM Card
  Metric: Reduce training memory by 72% (from 24GB to 6.8GB VRAM) while achieving an 84% win-rate against the SFT baseline on AlpacaEval.
  Tech Stack: PyTorch, bitsandbytes, Hugging Face TRL, PEFT

• Confidence-Weighted DPO: Noise-Resilient Human Preference Learning
  Metric: Increase alignment stability on noisy crowd-sourced preference data by 22% with 0% policy collapse.
  Tech Stack: PyTorch, Hugging Face Datasets, Scikit-learn, W&B

• Code-DPO: Reinforcement-Free Alignment for Unit Test Passing
  Metric: Improve HumanEval pass@1 from 38% to 54% on a 3B parameter model without costly online execution in the training loop.
  Tech Stack: PyTorch, PyTest, Docker Sandbox, vLLM`,
    },
  },
  {
    id: 'lora',
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    arxivId: '2106.09685',
    url: 'https://arxiv.org/abs/2106.09685',
    badge: 'Efficient Fine-Tuning',
    tokenMetrics: {
      promptTokens: 1150,
      candidateTokens: 1680,
      totalTokens: 2830,
      budgetLimit: 25000,
      budgetUsedPercent: 11,
      efficiencyStatus: 'OPTIMAL',
    },
    data: {
      paperMetadata: {
        title: 'LoRA: Low-Rank Adaptation of Large Language Models',
        authors: ['Edward J. Hu', 'Yelong Shen', 'Phillip Wallis', 'Zeyuan Allen-Zhu', 'Yuanzhi Li', 'Shean Wang', 'Lu Wang', 'Weizhu Chen'],
        year: '2021',
        venueOrArxiv: 'ICLR 2022 / arXiv:2106.09685',
        githubUrl: 'https://github.com/microsoft/LoRA',
        tags: ['PEFT', 'Low-Rank Adaptation', 'Fine-Tuning', 'GPU Memory Efficiency'],
      },
      coreConcept: {
        problemStatement:
          'Full fine-tuning of massive billion-parameter models requires updating and storing complete duplicate copies of all weights for each downstream task, creating catastrophic storage and hardware barriers for deployment.',
        primaryMethodology:
          'LoRA freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, drastically reducing the number of trainable parameters while adding zero inference latency when merged.',
        mathematicalAlgorithmicBreakthroughs:
          'Intrinsic rank hypothesis: W = W_0 + Delta_W where Delta_W = B * A, with B in R^(d x r), A in R^(r x k), and rank r << min(d, k). Matrix A is initialized with random Gaussian noise and B with zero, so Delta_W starts as zero.',
        accessibleSummary:
          'Instead of modifying all billions of connections in a large AI brain for a new task, LoRA freezes the original brain completely and trains tiny side-car adapter matrices that have only a fraction of the parameters. Because these matrices can be algebraically merged back into the main brain at runtime, it yields 10,000x fewer trainable parameters and zero extra delay during use.',
        wordCount: 182,
      },
      flowchart: {
        mermaidCode: `graph TD
  Input["Input Hidden State x (d_in)"] --> FrozenWeights["Frozen Pre-Trained Weights W_0 (d_in x d_out)"]
  Input --> MatrixA["Trainable LoRA Matrix A (d_in x r, Gaussian init)"]
  MatrixA --> MatrixB["Trainable LoRA Matrix B (r x d_out, Zero init)"]
  
  FrozenWeights --> BaseOutput["Base Forward: W_0 * x"]
  MatrixB --> Scaling["LoRA Delta: (alpha / r) * (B * A) * x"]
  
  BaseOutput & Scaling --> Summer["Summation: h = W_0*x + Delta_W*x"]
  Summer --> NextLayer["Output to Next Transformer Layer"]`,
        nodeExplanations: [
          { node: 'Frozen Pre-Trained Weights', description: 'Original model parameters kept unchanged to avoid catastrophic forgetting and memory duplication.' },
          { node: 'LoRA Matrix A', description: 'Projects high-dimensional input into a tiny low-rank latent bottleneck dimension r.' },
          { node: 'LoRA Matrix B', description: 'Expands low-rank features back up to match the model dimension.' },
          { node: 'Algebraic Merging', description: 'At deployment, W_0 + (alpha/r)*B*A can be folded into a single weight tensor with 0 latency overhead.' },
        ],
      },
      studentProjects: [
        {
          id: 1,
          title: 'AdaLoRA-Profiler: Dynamic Rank Allocation Across Attention vs FFN Layers',
          exactExtension:
            'Implement singular value decomposition (SVD) importance pruning to adaptively allocate rank r between attention query/value projections and feed-forward layers based on gradient energy.',
          targetedPerformanceMetric:
            'Achieve 15% higher parameter efficiency than fixed-rank LoRA on the GLUE benchmark with zero hyperparameter tuning of rank per layer.',
          recommendedTechStack: ['PyTorch', 'Hugging Face PEFT', 'SciPy', 'W&B'],
          difficulty: 'Intermediate (3rd-Year CS)',
          estimatedWeeks: 4,
          benchmarkDataset: 'GLUE (MNLI, SST-2, QNLI, CoLA)',
          resumeBulletPoint:
            'Created AdaLoRA-Profiler dynamically distributing low-rank capacity across layers, improving parameter efficiency by 15% on GLUE benchmarks.',
          implementationSteps: [
            'Track singular value magnitude of LoRA weight matrices during forward-backward passes.',
            'Formulate importance scoring to prune inactive rank dimensions during training.',
            'Compare performance against standard static r=8 and r=16 LoRA baselines.',
            'Package as an open-source PyTorch PEFT plugin with documentation.',
          ],
        },
        {
          id: 2,
          title: 'Multi-Task LoRA Router: Hot-Swappable Specialized Agents in Single GPU Memory',
          exactExtension:
            'Build a dynamic routing layer that stores 10 distinct task-specific LoRA adapters in CPU RAM and swaps them into a shared 7B base model in sub-10 milliseconds upon request classification.',
          targetedPerformanceMetric:
            'Serve 10 distinct enterprise tasks (SQL generation, summarization, translation) with 95% less VRAM than hosting 10 separate models.',
          recommendedTechStack: ['PyTorch', 'vLLM', 'FastAPI', 'Redis'],
          difficulty: 'Intermediate (3rd-Year CS)',
          estimatedWeeks: 4,
          benchmarkDataset: 'Spider SQL, GSM8K, and WMT14',
          resumeBulletPoint:
            'Built a Multi-Task LoRA router in FastAPI and PyTorch; served 10 specialized LLM tasks on a single GPU with sub-10ms adapter switching.',
          implementationSteps: [
            'Train 3 small domain-specific LoRA adapters on SQL, Math, and Translation tasks.',
            'Develop an embedding-based intent classifier to detect incoming user query task.',
            'Use dynamic weight swapping hooks to inject appropriate LoRA weights per request.',
            'Benchmark throughput and memory scaling in an async FastAPI server.',
          ],
        },
        {
          id: 3,
          title: 'LoRA-MoE: Low-Rank Mixture-of-Experts for Specialized Code Generation',
          exactExtension:
            'Combine low-rank adaptation with a top-k router to create a sparse Mixture-of-LoRAs without expanding baseline memory.',
          targetedPerformanceMetric:
            'Outperform standard LoRA by 4.2 points on HumanEval while maintaining identical single-GPU training memory budget.',
          recommendedTechStack: ['PyTorch', 'DeepSpeed', 'Hugging Face Transformers'],
          difficulty: 'Advanced',
          estimatedWeeks: 5,
          benchmarkDataset: 'HumanEval and MultiPL-E',
          resumeBulletPoint:
            'Engineered a Mixture-of-LoRAs (MoE) architecture in PyTorch, boosting HumanEval coding score by 4.2 points with zero memory expansion.',
          implementationSteps: [
            'Design top-2 softmax router directing token states to 4 parallel low-rank matrices.',
            'Add load-balancing auxiliary loss to prevent expert collapse.',
            'Benchmark against single LoRA and full fine-tuning on multi-language code datasets.',
            'Publish GitHub repo with pre-trained adapter weights.',
          ],
        },
      ],
      rawAgentOutput: `1. CORE CONCEPT EXTRACTION:
Problem: Full fine-tuning of massive billion-parameter models requires updating and storing complete duplicate copies of all weights for each downstream task, creating catastrophic storage and hardware barriers for deployment.
Methodology: LoRA freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, drastically reducing the number of trainable parameters while adding zero inference latency when merged.
Breakthroughs: Intrinsic rank hypothesis: W = W_0 + Delta_W where Delta_W = B * A, with B in R^(d x r), A in R^(r x k), and rank r << min(d, k). Matrix A is initialized with random Gaussian noise and B with zero, so Delta_W starts as zero.

2. ARCHITECTURAL FLOWCHART (Mermaid.js):
[FLOWCHART]
graph TD
  Input["Input Hidden State x (d_in)"] --> FrozenWeights["Frozen Pre-Trained Weights W_0 (d_in x d_out)"]
  Input --> MatrixA["Trainable LoRA Matrix A (d_in x r, Gaussian init)"]
  MatrixA --> MatrixB["Trainable LoRA Matrix B (r x d_out, Zero init)"]
  FrozenWeights --> BaseOutput["Base Forward: W_0 * x"]
  MatrixB --> Scaling["LoRA Delta: (alpha / r) * (B * A) * x"]
  BaseOutput & Scaling --> Summer["Summation: h = W_0*x + Delta_W*x"]
  Summer --> NextLayer["Output to Next Transformer Layer"]

3. FUTURE WORK & INTERNSHIP OPPORTUNITIES:
• AdaLoRA-Profiler: Dynamic Rank Allocation Across Attention vs FFN Layers
  Metric: Achieve 15% higher parameter efficiency than fixed-rank LoRA on the GLUE benchmark with zero hyperparameter tuning of rank per layer.
  Tech Stack: PyTorch, Hugging Face PEFT, SciPy, W&B

• Multi-Task LoRA Router: Hot-Swappable Specialized Agents in Single GPU Memory
  Metric: Serve 10 distinct enterprise tasks with 95% less VRAM than hosting 10 separate models.
  Tech Stack: PyTorch, vLLM, FastAPI, Redis

• LoRA-MoE: Low-Rank Mixture-of-Experts for Specialized Code Generation
  Metric: Outperform standard LoRA by 4.2 points on HumanEval while maintaining identical single-GPU training memory budget.
  Tech Stack: PyTorch, DeepSpeed, Hugging Face Transformers`,
    },
  },
];
