## Evaluation Scenarios and Data Collection Strategy
### Cross-Chain Content Rights Management Service

This document delineates the evaluation scenarios and data collection strategy for the CCRMS framework, aligning with the measurement-focused research objectives (RO1–RO6) and the Key Performance Indicators (KPIs) established in the Methodology chapter. The evaluation is structured to document attainable outcomes across technical, economic, and user-centric dimensions rather than to assess against predetermined benchmarks targets.

---

## 1. Evaluation Framework Overview

### 1.1 Evaluation Philosophy

The evaluation adopts an **exploratory, measurement-focused approach** wherein the primary objective is to:

1. **Document** what levels of performance, efficiency, and usability the CCRMS framework achieves
2. **Compare** measured results against established baselines (Ethereum L2s, centralised DRM, bridge-based solutions)
3. **Analyse** trade-offs between competing objectives (e.g., decentralisation vs. latency)
4. **Identify** limitations, bottlenecks, and areas for future improvement

This method ensures a valid academic contribution, irrespective of particular results achieved.

### 1.2 Mapping to Research Objectives

| Research Objective | Evaluation Focus | Primary Scenarios |
|--------------------|------------------|-------------------|
| RO1: XCM extensions for recurring transfers | Atomic success rates, cross-chain finality times | ES-01, ES-02, ES-03 |
| RO2: Unified ink! rights token | Access verification latency | ES-04, ES-05, ES-06 |
| RO3: Composable rights pallet | Feasibility and trade-offs of unification | ES-07, ES-08 |
| RO4: Benchmark against alternatives | TPS, costs, revenue retention comparison | ES-09, ES-10, ES-11 |
| RO5: Zero-knowledge proof hooks | Implementation feasibility | ES-12 |
| RO6: Creator savings quantification | Monte-Carlo simulation results | ES-13 |

---

## 2. Evaluation Scenarios

### Category A: Cross-Chain Functionality (RO1)

#### ES-01: Basic XCM Transfer Success Rate

**Objective:** Assess the success rate and finality duration of XCM messages that transmit rights metadata between parachains.

**Scenario Description:**
- Initiate 100 XCM transfers from CCRMS parachain to Asset Hub
- Each transfer carries a simulated rights token with metadata (expiration, royalty config)
- Vary payload sizes: minimal (256 bytes), standard (1 KB), maximum (4 KB)

**Test Parameters:**
| Parameter | Values |
|-----------|--------|
| Number of transfers | 100 per payload size (300 total) |
| Payload sizes | 256 B, 1 KB, 4 KB |
| Network conditions | Normal, congested (simulated) |
| Repetitions | 3 runs per configuration |

**Data to Collect:**
- Success/failure status for each transfer
- Time from send to confirmation (finality time)
- Error types for failed transfers
- Gas/weight consumed per transfer

**Expected Outputs:**
- Success rate percentage per configuration
- Mean, median, and standard deviation of finality times
- Failure mode classification

---

#### ES-02: Scheduled XCM Renewal Accuracy

**Objective:** Evaluate the reliability and timing accuracy of scheduled XCM messages for subscription auto-renewal.

**Scenario Description:**
- Schedule 50 subscription renewals at specific future block heights
- Block height intervals: 10 blocks, 100 blocks, 1000 blocks ahead
- Measure actual execution time vs. scheduled time

**Test Parameters:**
| Parameter | Values |
|-----------|--------|
| Number of scheduled renewals | 50 per interval (150 total) |
| Scheduling intervals | 10, 100, 1000 blocks |
| Pre-authorised balance states | Sufficient, insufficient, exact |

**Data to Collect:**
- Scheduled block height vs. actual execution block
- Timing deviation (blocks early/late)
- Success rate based on balance availability
- Behaviour during chain congestion

**Expected Outputs:**
- Scheduling accuracy metrics (deviation distribution)
- Renewal success rate by balance state
- Identified edge cases and failure modes

---

#### ES-03: Cross-Chain Royalty Distribution

**Objective:** Measure the reliability and latency of multi-recipient royalty distributions across chains.

**Scenario Description:**
- Simulate secondary sale triggering royalty distribution
- Recipients distributed across: CCRMS parachain (2), Asset Hub (2), external chain simulation (1)
- Vary royalty split complexity: 2, 5, 10 recipients

**Test Parameters:**
| Parameter | Values |
|-----------|--------|
| Number of test sales | 30 per split configuration (90 total) |
| Recipient counts | 2, 5, 10 |
| Recipient locations | Mixed (local + cross-chain) |

**Data to Collect:**
- Time from sale to all royalties received
- Per-recipient delivery success/failure
- Total gas cost for distribution
- Partial failure handling behaviour

**Expected Outputs:**
- End-to-end royalty distribution time by complexity
- Success rate per recipient location type
- Cost scaling analysis

---

### Category B: Access Verification Performance (RO2)

#### ES-04: Subscription Access Verification Latency

**Objective:** Measure end-to-end latency for subscription-based access verification under varying conditions.

**Scenario Description:**
- User requests content access with active subscription
- Measure time from request to access granted/denied response
- Test across different subscription states (active, near-expiry, expired)

**Test Parameters:**
| Parameter | Values |
|-----------|--------|
| Number of requests | 500 per state (1500 total) |
| Subscription states | Active (>7 days), Near-expiry (<24 hours), Expired |
| Concurrent requests | 1, 10, 50, 100 simultaneous |

**Data to Collect:**
- Request-to-response latency (milliseconds)
- Breakdown: network, on-chain query, response formatting
- Throughput under concurrent load
- Error rates under load

**Expected Outputs:**
- Latency distribution by subscription state
- Latency vs. concurrency curves
- Maximum sustainable concurrent requests

---

#### ES-05: PPV Counter Verification and Decrement

**Objective:** Measure latency and accuracy of PPV counter operations (check + decrement).

**Scenario Description:**
- User with View Pack (counter = 10) requests content view
- Measure verification + decrement as single atomic operation
- Test boundary conditions (counter = 1, counter = 0)

**Test Parameters:**
| Parameter | Values |
|-----------|--------|
| Number of view requests | 200 per counter state (600 total) |
| Counter states | Full (10), Partial (5), Final (1), Exhausted (0) |
| Request patterns | Sequential, burst (10 rapid requests) |

**Data to Collect:**
- Verification + decrement latency
- Counter accuracy (no double-spend, no over-decrement)
- Behaviour at boundary (counter = 1 → 0)
- Race condition handling under burst

**Expected Outputs:**
- Latency distribution for PPV operations
- Counter integrity verification results
- Concurrent access handling analysis

---

#### ES-06: Ownership Verification with Perpetual Subscription

**Objective:** Verify that ownership check correctly returns perpetual subscription status without separate queries.

**Scenario Description:**
- User owns content NFT with embedded perpetual subscription
- Request access verification
- Compare query complexity vs. separate ownership + subscription checks

**Test Parameters:**
| Parameter | Values |
|-----------|--------|
| Number of verifications | 300 |
| Ownership states | Owner, non-owner, bridged owner |
| Query methods | Unified query, separate queries (for comparison) |

**Data to Collect:**
- Latency for unified vs. separate queries
- Storage reads required per method
- Response correctness verification

**Expected Outputs:**
- Latency comparison: unified vs. separate approach
- Storage efficiency metrics
- Validation of unified rights token concept

---

### Category C: Monetisation Model Integration (RO3)

#### ES-07: Model Transition Scenarios

**Objective:** Evaluate the feasibility and user experience of transitioning between monetisation models.

**Scenario Description:**
- User holds PPV View Pack, upgrades to subscription
- User with subscription upgrades to ownership
- User with expired subscription purchases PPV

**Test Transitions:**
| Transition | Expected Behaviour |
|------------|-------------------|
| PPV → Subscription | Retain remaining views + add subscription |
| Subscription → Ownership | Convert to perpetual, cancel scheduled renewals |
| Expired Subscription → PPV | Issue View Pack, retain expired sub record |
| PPV → Ownership | Retain remaining views + add perpetual access |

**Data to Collect:**
- Transaction success/failure for each transition
- State consistency before/after transition
- User-facing latency for upgrade operations
- Edge case handling (e.g., mid-renewal upgrade)

**Expected Outputs:**
- Transition feasibility matrix
- Identified state management challenges
- Recommended transition patterns

---

#### ES-08: Bundled Access Verification

**Objective:** Test scenarios where users hold multiple access types simultaneously.

**Scenario Description:**
- User holds: active subscription + View Pack (5 remaining) + owned content (different item)
- Request access to various content items
- Verify correct access type resolution

**Test Cases:**
| Content Requested | User Rights | Expected Resolution |
|-------------------|-------------|---------------------|
| Content A | Subscription (active) | Grant via subscription |
| Content B | PPV (5 views) | Grant via PPV, decrement |
| Content C | Ownership | Grant via perpetual |
| Content D | None | Deny access |
| Content A | Subscription (expired) + PPV available | Prompt renewal or use PPV |

**Data to Collect:**
- Access resolution correctness
- Resolution priority logic verification
- Query complexity for multi-right scenarios

**Expected Outputs:**
- Access resolution accuracy rate
- Priority handling documentation
- Complex state management analysis

---

### Category D: Scalability and Performance (RO4)

#### ES-09: Transaction Throughput Under Load

**Objective:** Measure maximum sustainable TPS for core operations on the CCRMS parachain.

**Scenario Description:**
- Generate synthetic load simulating realistic usage patterns
- Operation mix: 60% access verifications, 25% PPV purchases, 10% subscriptions, 5% ownership transfers
- Gradually increase load until performance degradation observed

**Test Parameters:**
| Parameter | Values |
|-----------|--------|
| Load levels (TPS target) | 10, 50, 100, 200, 500, 1000 |
| Test duration per level | 5 minutes sustained |
| Operation mix | As described above |
| Node configurations | 5, 10, 20, 50 validator nodes |

**Data to Collect:**
- Actual achieved TPS at each load level
- Latency percentiles (p50, p95, p99) at each level
- Block production consistency
- Resource utilisation (CPU, memory, network)

**Expected Outputs:**
- TPS capacity curve by node configuration
- Latency degradation analysis
- Bottleneck identification
- Optimal operating parameters

---

#### ES-10: Comparative Benchmark: Ethereum L2

**Objective:** Compare CCRMS performance against equivalent operations on Ethereum L2 (e.g., Arbitrum, Optimism).

**Scenario Description:**
- Implement equivalent PPV and subscription logic as Solidity contracts
- Deploy to Ethereum L2 testnet
- Run identical test scenarios on both platforms

**Comparison Metrics:**
| Metric | CCRMS Measurement | Ethereum L2 Measurement |
|--------|-------------------|-------------------------|
| TPS (PPV operations) | From ES-09 | Equivalent test |
| Transaction cost | DOT/KSM equivalent | ETH gas cost |
| Finality time | Block confirmation | L2 + L1 finality |
| Cross-chain transfer time | XCM to Asset Hub | Bridge to L1/other L2 |

**Data to Collect:**
- Side-by-side performance metrics
- Cost in USD equivalent at test-time prices
- Developer experience notes (qualitative)

**Expected Outputs:**
- Comparative performance table
- Cost efficiency analysis
- Trade-off discussion for thesis

---

#### ES-11: Comparative Benchmark: Centralised DRM

**Objective:** Compare CCRMS latency and costs against centralised DRM baseline.

**Scenario Description:**
- Establish baseline using simulated centralised DRM (AWS Lambda + DynamoDB)
- Measure equivalent operations: access check, purchase, subscription renewal
- Compare latency, cost, and throughput

**Centralised Baseline Setup:**
- AWS Lambda for access verification logic
- DynamoDB for rights storage
- API Gateway for request handling
- CloudWatch for metrics collection

**Comparison Metrics:**
| Metric | CCRMS | Centralised Baseline |
|--------|-------|---------------------|
| Access verification latency | Measured | Lambda cold/warm start |
| Throughput capacity | Measured TPS | Lambda concurrent executions |
| Cost per 1000 operations | DOT/KSM fees | AWS pricing |
| Decentralisation (HHI) | Calculated | N/A (centralised) |

**Data to Collect:**
- Latency comparison across operation types
- Cost comparison at various scales (1K, 10K, 100K operations)
- Availability/uptime comparison

**Expected Outputs:**
- Latency comparison analysis
- Total cost of ownership comparison
- Trade-off matrix (decentralisation vs. performance)

---

### Category E: Security and Reliability (RO4 continued)

#### ES-12: Zero-Knowledge Proof Feasibility (RO5)

**Objective:** Assess the feasibility of integrating ZK proof hooks for selective regulatory disclosure.

**Scenario Description:**
- Implement proof-of-concept ZK circuit for proving subscription validity without revealing user identity
- Measure proof generation time, verification time, and proof size
- Evaluate integration complexity with CCRMS architecture

**Test Parameters:**
| Parameter | Values |
|-----------|--------|
| ZK framework | RISC Zero or zkMega (based on availability) |
| Proof types | Subscription validity, purchase ownership, revenue threshold |
| Hardware | Standard development machine (baseline) |

**Data to Collect:**
- Proof generation time
- Proof verification time (on-chain)
- Proof size (bytes)
- Integration effort estimate (developer hours)

**Expected Outputs:**
- Feasibility assessment (viable/not viable/conditionally viable)
- Performance characteristics documentation
- Recommendations for future implementation

---

### Category F: Economic Analysis (RO6)

#### ES-13: Monte-Carlo Creator Revenue Simulation

**Objective:** Quantify potential creator savings using the CCRMS framework compared to alternatives.

**Scenario Description:**
- Model creator revenue flows under different platforms
- Simulate 1000 creators with varying content types and audience sizes
- Run 10,000 Monte-Carlo iterations to capture variance

**Simulation Parameters:**
| Parameter | Distribution |
|-----------|--------------|
| Audience size | Log-normal (μ=1000, σ=2) |
| Content price | Uniform ($1–$50) |
| Subscription rate | Beta (α=2, β=5) |
| PPV conversion | Beta (α=1, β=10) |
| Secondary sale probability | Exponential (λ=0.1) |

**Platform Fee Structures:**
| Platform Type | Creator Retention |
|---------------|-------------------|
| Centralised (YouTube, Spotify) | 55–70% |
| Existing Web3 (OpenSea, etc.) | 85–92.5% |
| Bridge-based solutions | 85–92% |
| CCRMS (estimated) | 95–99% (to be measured) |

**Data to Collect:**
- Revenue distribution per platform type
- Creator earnings variance
- Break-even analysis (when does CCRMS become advantageous?)
- Sensitivity to parameter changes

**Expected Outputs:**
- Expected creator savings distribution
- Confidence intervals for savings estimates
- Scenario analysis (best/worst/typical cases)

---

## 3. Data Collection Strategy

### 3.1 Quantitative Data Collection

#### 3.1.1 On-Chain Metrics

**Collection Method:** Substrate telemetry + custom event logging

**Tools:**
- Prometheus for metrics aggregation
- Grafana for visualisation and alerting
- SubQuery for historical event indexing
- Custom Rust scripts using subxt for transaction submission

**Metrics to Capture:**
| Metric Category | Specific Metrics | Collection Frequency |
|-----------------|------------------|---------------------|
| Transaction Performance | TPS, latency, gas used | Per-block |
| XCM Operations | Success rate, finality time, payload size | Per-message |
| State Changes | NFT mints, transfers, burns, counter updates | Per-event |
| Resource Utilisation | Block weight, storage growth | Per-block |

**Data Schema:**
```
{
  "timestamp": "ISO-8601",
  "block_number": integer,
  "event_type": string,
  "operation": string,
  "latency_ms": float,
  "gas_used": integer,
  "success": boolean,
  "error_code": string | null,
  "metadata": object
}
```

#### 3.1.2 Off-Chain Metrics

**Collection Method:** Application-level instrumentation

**Tools:**
- Custom logging framework
- Structured JSON logs
- Time-series database (InfluxDB or TimescaleDB)

**Metrics to Capture:**
| Metric Category | Specific Metrics | Collection Frequency |
|-----------------|------------------|---------------------|
| API Performance | Request latency, throughput | Per-request |
| User Sessions | Session duration, actions per session | Per-session |
| Error Rates | Error types, frequency, recovery time | Per-error |

#### 3.1.3 Comparative Baseline Data

**Collection Method:** Parallel testing on alternative platforms

**Ethereum L2 Data:**
- Deploy equivalent contracts to Arbitrum Sepolia / Optimism Goerli
- Use Hardhat for deployment and testing
- Etherscan API for transaction data

**Centralised Baseline Data:**
- AWS CloudWatch metrics
- Lambda execution logs
- DynamoDB consumed capacity units

### 3.2 Qualitative Data Collection

#### 3.2.1 Expert Interviews

**Participants:** 5–10 blockchain developers/researchers with Polkadot/Kusama experience

**Recruitment:** Polkadot forums, academic networks, Web3 developer communities

**Interview Protocol:**
- Semi-structured format (45–60 minutes)
- Topics: Architecture review, feasibility assessment, improvement suggestions
- Recording: Audio with consent, transcribed for analysis

**Sample Questions:**
1. How does the RMRK 2.0 + scheduled XCM approach compare to alternatives you've seen?
2. What potential issues do you foresee with the unified rights token model?
3. How would you assess the production-readiness of this architecture?

#### 3.2.2 User Testing Sessions

**Participants:** 20–30 users (mix of content creators and consumers)

**Recruitment:** Web3 communities, blockchain user groups, university networks

**Session Structure:**
1. Pre-test questionnaire (demographics, Web3 experience)
2. Guided task completion (subscribe, PPV purchase, ownership transfer)
3. Think-aloud protocol during tasks
4. Post-test questionnaire (usability, satisfaction)
5. Semi-structured debrief interview

**Tasks for User Testing:**
| Task ID | Description | Monetisation Model |
|---------|-------------|-------------------|
| UT-01 | Subscribe to content for 30 days | Subscription |
| UT-02 | Purchase 5-view pack and consume 2 views | PPV |
| UT-03 | Buy content permanently | Purchase |
| UT-04 | Transfer owned content to different wallet | Ownership transfer |
| UT-05 | Upgrade from subscription to ownership | Model transition |

#### 3.2.3 Usability Questionnaires

**Instrument:** System Usability Scale (SUS) + custom questions

**SUS Questions (standard 10-item scale):**
- Scored 0–100, industry benchmark ~68

**Custom Questions (5-point Likert scale):**
1. The process of subscribing to content was straightforward.
2. I understood how my PPV views were being tracked.
3. I felt confident that my ownership rights were secure.
4. The cross-chain transfer process was clear.
5. I would use this system for real content purchases.

### 3.3 Data Collection Timeline

| Week | Activities | Data Types |
|------|------------|------------|
| 17 | Testnet setup, baseline configuration, ES-01 to ES-03 | On-chain XCM metrics |
| 17 | Centralised baseline deployment | Comparative baseline data |
| 18 | ES-04 to ES-08, user recruitment | Access verification metrics, participant screening |
| 18 | User testing sessions (n=10) | Qualitative usability data |
| 19 | ES-09 to ES-11, expert interviews | Scalability metrics, qualitative expert feedback |
| 19 | User testing sessions (n=10–20) | Additional usability data |
| 20 | ES-12, ES-13, data consolidation | ZK feasibility, simulation results |
| 20 | Data analysis and preliminary findings | All data types |

### 3.4 Data Storage and Management

**Storage Infrastructure:**
- Raw data: Encrypted cloud storage (institutional account)
- Processed data: Local analysis environment
- Code and scripts: GitHub repository (public, MIT license)

**Data Retention:**
- Quantitative data: Retained indefinitely for reproducibility
- Qualitative data: Anonymised transcripts retained; audio deleted after transcription
- User data: Anonymised within 30 days of collection

**Backup Strategy:**
- Daily automated backups during evaluation phase
- Version control for all analysis scripts
- Export to multiple formats (CSV, JSON, Parquet)

---

## 4. Analysis Approach

### 4.1 Quantitative Analysis

**Descriptive Statistics:**
- Central tendency (mean, median, mode) for all metrics
- Dispersion (standard deviation, IQR, range)
- Distribution visualisation (histograms, box plots)

**Comparative Analysis:**
- Paired comparisons (CCRMS vs. Ethereum L2, CCRMS vs. centralised)
- Statistical significance testing where appropriate (t-tests, Mann-Whitney U)
- Effect size calculation (Cohen's d)

**Performance Modelling:**
- Regression analysis for latency vs. load relationships
- Capacity modelling using queuing theory
- Cost projection models

### 4.2 Qualitative Analysis

**Thematic Analysis:**
- Open coding of interview transcripts
- Axial coding to identify relationships
- Selective coding for core themes

**Usability Analysis:**
- SUS score calculation and benchmarking
- Task completion rate analysis
- Error classification and frequency

### 4.3 Mixed-Methods Integration

**Convergent Design:**
- Quantitative and qualitative data collected in parallel
- Results compared and contrasted in Discussion chapter
- Discrepancies investigated and explained

**Integration Points:**
| Quantitative Finding | Qualitative Validation |
|---------------------|----------------------|
| Access latency measurements | User perception of responsiveness |
| XCM success rates | Expert assessment of reliability |
| Cost metrics | Creator willingness to adopt |

---

## 5. Ethical Considerations

### 5.1 Participant Protection

- Informed consent obtained from all interview and testing participants
- Right to withdraw at any time without consequence
- No collection of personally identifiable information beyond demographics
- Data anonymisation before analysis

### 5.2 Research Integrity

- All test scenarios documented and reproducible
- Raw data preserved for verification
- Negative or unexpected results reported transparently
- Limitations explicitly acknowledged

### 5.3 Institutional Compliance

- Ethics approval obtained from University of Malta (if required)
- GDPR compliance for any EU participant data
- Open-source code release for community verification

---

## 6. Summary

This evaluation strategy provides a comprehensive framework for measuring the CCRMS framework's performance, usability, and economic viability. The 13 evaluation scenarios cover all six research objectives, while the mixed-methods data collection strategy ensures both rigorous quantitative measurement and rich qualitative insight.

**Key Deliverables from Evaluation:**
1. Performance metrics across all KPI categories
2. Comparative analysis against Ethereum L2 and centralised alternatives
3. Feasibility assessment for ZK proof integration
4. Monte-Carlo simulation results for creator savings
5. Usability scores and user feedback synthesis
6. Expert validation of architectural decisions

The measurement-focused approach ensures that regardless of specific outcomes, the evaluation produces meaningful academic contribution through documented findings, comparative analysis, and actionable recommendations.

---

*This document satisfies the Phase 2 Week 9-10 deliverable: "Design evaluation scenarios and data collection strategy." It is prepared for integration into the thesis Methodology and Evaluation chapters.*
