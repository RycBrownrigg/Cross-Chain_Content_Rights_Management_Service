### Summary of the Systematic Literature Review (v2 — April 2026 Update)

This updated systematic literature review expands upon the original version 1 (November 2025, comprising 78 sources) by incorporating 24 additional publications identified between November 2025 and April 2026, thereby increasing the total to **102 sources**. The review continues to rigorously analyze scholarly and industry publications relating to cross-chain content rights management services, with a particular focus on decentralized frameworks for subscription, pay-per-view (PPV), and purchase modalities. The new searches encompassed Google Scholar, arXiv, IEEE, ACM, Frontiers, MDPI, official publications from the Polkadot/Web3 Foundation, European Union regulatory bodies, and industry market research databases.

#### Key Themes

- **Blockchain for DRM and Copyright Protection**: The DRM market continues its projected growth trajectory. MarketsandMarkets (2025) values the market at USD 6.72 billion in 2025, projected to reach USD 11.05 billion by 2030 (CAGR 10.5%). Mordor Intelligence (2026) corroborates with USD 6.93 billion in 2026, growing to USD 11.76 billion by 2031 (CAGR 11.16%). New work by Madapati & Pradhan (2025) provides practical TPS benchmarks for on-chain copyright operations (409 TPS for registration, 484 TPS for verification), while Wang et al. (2025) introduce BLS threshold signatures for IP transaction traceability with a 40ms aggregation time. A 2026 MDPI publication extends blockchain DRM to library systems by leveraging IPFS and smart contract-based key management. These developments reinforce the thesis's emphasis on decentralized, low-fee alternatives incorporating diverse monetization models.

- **Cross-Chain Interoperability**: This theme has observed the most substantial advancements. Two major surveys from 2025, Deng et al. (comprising over 150 sources, available on arXiv) and Li et al. (*Blockchain: Research and Applications*), provide comprehensive taxonomies of cross-chain solutions, effectively distinguishing between asset and data interoperability. Maric et al. (2025) contribute formal verification of bridge safety properties utilizing Isabelle/HOL. Most notably for this thesis, **Snowbridge V2 was launched in November 2025** with a 50% reduction in fees, support for arbitrary Ethereum contract calls from Polkadot, and a total value locked (TVL) of $75 million, thereby transitioning the Ethereum-Polkadot bridge from a theoretical concept to a production, validated solution. **Polkadot 2.0 has now been fully delivered**, incorporating Async Backing, Agile Coretime, and Elastic Scaling, all of which have been operational since October 2025, achieving a block latency of 2 seconds with 3 cores.

- **Decentralized Monetization Models**: The blockchain content monetization market increased by 32% year-over-year, reaching USD 659 million in 2025. Projections indicate this market will attain USD 2.74 billion by 2030, with a compound annual growth rate of 32.78% (360iResearch, 2025). Furthermore, the creator economy is anticipated to surpass USD 280 billion by the end of 2026. An noteworthy technological advancement is Coinbase's **x402 protocol** (May 2025), which integrates payment logic directly into HTTP responses, enabling settlement times of less than two seconds. This development signifies a transition towards protocol-level micropayment integration, pertinent to the pay-per-view (PPV) model discussed in this thesis. These market statistics considerably reinforce the economic justification for on-chain monetization alternatives.

- **NFTs and IP Rights**: The most significant development is the launch of **Story Protocol** (February 2025), a dedicated IP Layer-1 blockchain with $140 million in funding, led by a16z with an $80 million Series B investment. This platform enables programmable intellectual property registration, automated licensing, and on-chain royalty distribution. It validates the thesis's problem statement while offering a Cosmos-based comparator to the Polkadot approach. Darshan et al. (2025) present concerning statistics: 80% of mainstream NFTs fail to transfer copyright; only 12-30% of marketplace listings include licensing information; and 50-60% of secondary sales circumvent creator royalties, highlighting the necessity of on-chain rights management. Li et al. (2025) utilize the Analytic Hierarchy Process (AHP) methodology to rank barriers to blockchain intellectual property adoption, finding that regulatory obstacles (0.308 weight) outweigh technological challenges (0.198).

- **Smart Contracts and Virtual Machines**: A significant transition occurred in January 2026, when **the development of ink! was officially ceased due to unsuccessful funding proposals from the OpenGov treasury. This development directly affects the implementation of ink! 6 within the thesis; however, the code remains functional as a proof-of-concept on pallet-revive/PolkaVM. Alternatives include utilizing low-level Rust via pallet-revive, rewriting in Solidity, or employing the community-maintained wrevive SDK. Notably, Vitalik Buterin proposed replacing Ethereum's EVM with RISC-V in April 2025, citing a 100-fold increase in efficiency, which validates Polkadot's early adoption of the PolkaVM/RISC-V architecture. The 2025 R0GUE project demonstrated ink!'s capability to achieve Solidity ABI compatibility on PolkaVM, illustrating the pathway toward cross-VM interoperability.

- **Polkadot Ecosystem Evolution** *(New)*: The Polkadot ecosystem has undergone significant transformative changes. The **JAM (Join-Accumulate Machine)** specification has advanced from the Gray Paper to operational status on the testnet as of January 2026, with 43 development teams competing for a prize of 10 million DOT. The mainnet is targeted for deployment in mid-2026. JAM signifies a fundamental shift in architecture from the relay chain model, integrating elements of both Polkadot and Ethereum into a global, permissionless, singleton object environment. The vision for Plaza, aimed at unifying smart contracts on the Polkadot Hub, is evolving concurrently with the deployment of PolkaVM, which is live on Westend, with Kusama scheduled for Q2 25, and Polkadot planned for subsequent phases Q3/25).

- **Regulatory Landscape** *(New)*: Two significant regulatory developments influence the thesis domain. The **EU AI Act** copyright provisions became effective in August 2025, mandating that general-purpose AI providers adhere to copyright laws and disclose summaries of training data (Guadamuz, 2025). The European Parliament further proposed enhanced licensing and remuneration regimes for AI training data in January 2026. These regulations generate a regulatory demand for on-chain rights provenance systems. Meanwhile, **MiCA** advances toward full enforcement by July 2026, explicitly excluding NFTs unless they are marketed as fungible or fractional, although the substance-over-form approach implies that subscription tokens with fungible characteristics might also be subject to regulation compliance.

#### Emerging Gaps and Opportunities (Updated)

The literature review reveals several updated gaps:

1. **Post-ink! smart contract development on Polkadot** — As ink! has been discontinued, there is a lack of academic literature investigating alternative Rust-based smart contract approaches on pallet-revive, thereby leaving a gap that this thesis aims to partially address.
2. **Cross-chain rights management with production bridges** — Although Snowbridge V2 is now operational, scholarly research concerning cross-chain copyright management (for instance, Xie & Tang, 2024) remains in the theoretical stage. Empirical assessment utilizing production infrastructure is absent.
3. **Regulatory compliance of on-chain rights tokens** — The intersection of MiCA token classification, EU AI Act copyright provisions, and blockchain-based rights management remains underexplored in academic circles literature.
4. **Comparative analysis of IP-on-chain approaches** — With the implementation of Story Protocol (Cosmos/EVM) and the research conducted in this thesis (Polkadot/XCM), there exists an opportunity for a systematic comparison of architectural methodologies pertaining to on-chain intellectual property management.
5. **Economic models validated with production data** — Despite increasing market figures, few studies offer Monte Carlo or empirical validation of creator revenue models across centralized and decentralized platforms systems.

Overall, the revised literature firmly supports the feasibility and market significance of cross-chain content rights systems, while emphasizing the swift development of the foundational technology stack (notably the discontinuation of ink! and the transition to JAM) as both a challenge and confirmation of the thesis timing.

---

### Annotated Bibliography

The following annotated bibliography comprises **102 selected sources**: the original 78 from v1 (November 2025) plus 24 new entries (numbered 79–102). Each entry includes a citation and a concise annotation summarizing key contributions, relevance to the thesis, and identified limitations. Entries are organized thematically.

---

#### Blockchain for DRM and Copyright Protection

1. **Alotaibi, S. J. (2023)**. Using smart contracts in the proposed blockchain framework for an identity management system based on the Internet of Things. *International Journal of Distributed Systems Technology, 14*(1), 1-22.  
   
   **Annotation:** This the article underscores the necessity of this initiative by evaluating its feasibility in light of the limited available solutions. The proposed framework carefully considers two perspectives, examining eleven factors and emphasizing the essential features identified through research. 
   
2. **Ante, L. (2020)**. Smart contracts on the blockchain – A bibliometric analysis and review. *SSRN Electronic Journal*. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3576393  
   
   **Annotation:** This paper reviews peer-reviewed articles and references, summarizing current research. Using exploratory factor analysis, six research strands are identified: I) blockchain foundations and open questions, II) smart contracts in IoT, III) standardization, verification, and security, IV) industry disruption, V) potentials and challenges, and VI) legal aspects. 

3. **Balcerzak, A. P., et al. (2022)**. Blockchain technology and smart contracts in decentralized governance systems. *Administrative Sciences, 12*(3), 96. https://doi.org/10.3390/admsci12030096  
   
   **Annotation:** This article examines the application of blockchain technology for governance purposes, specifically in facilitating transparent revenue sharing associated with content rights. It adheres to the principles of decentralization in assessment; however, it is confined to non-technical context studies.

4. **Chen, F., et al. (2020)**. Blockchain for Internet of Things applications: A review and open issues. *Journal of Network and Computer Applications, 173*, 102854. https://doi.org/10.1016/j.jnca.2020.102854  
   
   **Annotation:** This paper reviews recent advances in employing blockchain technology to develop more reliable Internet of Things (IoT) systems. It categorizes the research into four distinct roles of blockchain within IoT: access control platform, data security platform, trusted third party, and automatic payment platform, while discussing the future challenges associated with each role.

5. **Divyashree, K. S., & Mishra, A. (2023)**. Blockchain technology in financial sector and its legal implications. *Lecture Notes in Networks and Systems, 478*, 219-231.  
   
   **Annotation:** This paper aims to explore how blockchain technology is utilized within the financial sector and to analyze the associated legal implications. It will define the concept of blockchain technology, examine its applications in the financial industry, discuss the necessity for regulation, and ultimately, present conclusions along with proposed corrective measures.

6. **Habermeier, R., et al. (2021)**. Polkadot's messaging scheme. *Web3 Foundation Research*. https://medium.com/web3foundation/polkadots-messaging-scheme-b1ec560908b7  
   
   **Annotation:** Details XCM for cross-chain communication. It is fundamental to the methodology of the proposal and demonstrates efficiency trade-offs.

7. **Kumar, R. K., et al. (2023)**. Revolutionizing digital ownership: Examining the perks of a Polkadot-based NFT marketplace. *ResearchGate*. https://doi.org/10.13140/RG.2.2.26304.87040  
   
   **Annotation:** As Polkadot's ecosystem expands, this research investigates its impact on the broader NFT market, providing valuable insights into the future of digital ownership. This study aids the ongoing discourse regarding the transformation of the digital realm through decentralized and efficient ownership mechanisms by assessing the benefits of Polkadot-based NFT marketplaces.

8. **Lin, S. Y., et al. (2022)**. A survey of application research based on blockchain smart contract. *Wireless Networks, 28*, 635-690. https://doi.org/10.1007/s11276-021-02874-2  
   
   **Annotation:** This paper examines the development and challenges associated with blockchain smart contracts. It addresses the technical difficulties encountered by smart contracts, analyzes their influence on large-scale applications and the sustainability of mining systems, and explores future research directions in the field of blockchain smart contracts.

9. **Parity Technologies. (2022)**. ink! 3.0: Parity's Rust-based language for WASM smart contracts gets a major update. https://www.parity.io/blog/ink-3-0-paritys-rust-based-language-gets-a-major-update  
   
   **Annotation:** Updates concerning ink! for WebAssembly contracts are essential for implementation and focus on performance enhancements.

10. **Parity Technologies. (2022)**. What is Parity's ink!? https://www.parity.io/blog/what-is-paritys-ink  
    
    **Annotation:** Introduction to ink! for smart contracts. Guides the proposal's development; practical for prototyping.

11. **Singh, R., et al. (2024**). Insights into research on blockchain for smart contracts: A bibliometric analysis. *Multimedia Tools and Applications, 83*, 1-25. https://doi.org/10.1007/s11042-023-15647-1  
    
    **Annotation:** This comprehensive bibliometric study aims to understand blockchain trends in smart contracts and provide future directions in this field. This analysis entails several systematic steps, beginning with the formulation of the research question, defining the scope of the investigation, extracting and analyzing data, answering the research question, and ultimately drawing conclusions.

12. **Velmovitsky, P. E., et al. (2021)**. Blockchain applications in health care and public health: Increased transparency. *JMIR Medical Informatics, 9*(6), e25893. https://doi.org/10.2196/25893  
    
    **Annotation:** A systematic literature review was conducted to provide a comprehensive overview of blockchain solutions designed to address challenges within the healthcare sector, with a specific emphasis on initiatives developed by organizations operating at the intersection of health and technology.

13. **Wood, G. (2016)**. Polkadot: Vision for a heterogeneous multi-chain framework. *White Paper*. https://polkadot.network/whitepaper  
    
    **Annotation:** This document aims to provide a technical 'vision' summary of a potential direction for further development of the blockchain paradigm, accompanied by the rationale supporting its viability. It delineates, to the extent possible at this preliminary stage, a system that could offer tangible improvements across various aspects of blockchain technology.

14. **Wood, G. (2022)**. XCM: The cross-consensus message format. *Polkadot Blog*. https://www.polkadot.network/blog/xcm-the-cross-consensus-message-format  
    
    **Annotation:** Provides an explanation of the XCM format. It is essential for cross-chain integration and addresses multi-hop capabilities communication.

15. **Xie, R., & Liu, Y. (2022)**. Research on copyright protection of digital works based on multi-blockchain. *Recent Advances in Computer Science and Communications, 15*(8), 1126-1134. https://doi.org/10.2174/2666255815666220204092947  
    
    **Annotation:** This paper introduces a Polkadot scheme using cross-chain blockchain technology to protect digital works' copyright. It creates three parallel chains—the digital works, copyright management, and dispute arbitration chains—that illustrate information exchange among Validators, Fishermen, Collators, and Nominators.

16. **Xie, R., & Tang, M. (2024)**. A digital resource copyright protection scheme based on blockchain cross-chain technology. *Heliyon, 10*(16), e34781. https://doi.org/10.1016/j.heliyon.2024.e34781  
    
    **Annotation:** This study uses blockchain cross-chain solutions to create a copyright protection scheme that improves system efficiency, scalability, and real-world relevance. It offers a more effective way to safeguard digital copyrights, encompassing registration, transactions, modifications, and enforcement.
    
17. **Garba, A., et al. (2021)**. A digital rights management system based on a scalable blockchain. https://research-api.cbs.dk/ws/portalfiles/portal/93314574/abba_garba_et_al_a_digital_rights_management_system_based_on_a_scalable_blockchain_publishersversion.pdf  
    
    **Annotation:** This paper presents a distributed media transaction framework for DRM that uses digital watermarking and a scalable blockchain. It improves traditional blockchain systems for DRM, restricting access to authorized users and providing original multimedia content.

18. **Finck, M. (2018)**. Blockchain regulation and governance in Europe. *Cambridge University Press* (excerpt from SSRN). https://papers.ssrn.com/sol3/Delivery.cfm/SSRN_ID3351542_code3242224.pdf  
    
    **Annotation:** The DRM solution manages the distribution of content after its release. It improves transparency and emphasizes permission-based access chains.

19. **Patil, S. S., et al. (2022)**. Blockchain Based Multimedia Content Protection Using Encryption in DRM (Digital Rights Management). https://ijirt.org/publishedpaper/IJIRT156400_PAPER.pdf  
    
    **Annotation:** This paper explores the utilization of encryption in conjunction with Digital Rights Management (DRM) on blockchain technology to store and generate hash values for original and protected content, such as images, audio, and video. It introduces the creation of hash identifiers and demonstrates blockchain-based copyright protection, ensuring that content is securely delivered to appropriate users. DRMChain provides reliable, high-level content protection with efficient authentication.

20. **Singh, R., et al. (2024)**. Blockchain-Based Digital Rights Management and Its Impact on English Language Resources in Libraries. https://www.igi-global.com/viewtitle.aspx?TitleId=360345&isxn=9798369396162  
    
    **Annotation:** This research explores the integration of blockchain technology into Digital Rights Management (DRM) systems for the management of English language resources within libraries. The study assesses blockchain's potential to augment DRM by enhancing security, accessibility, and the long-term preservation of such resources.

79. **Madapati, S. L. & Pradhan, N. R. (2025)**. Decentralizing video copyright protection: a novel blockchain-enabled framework with performance evaluation. *Frontiers in Artificial Intelligence, 8*. https://pmc.ncbi.nlm.nih.gov/articles/PMC12399541/

    **Annotation:** Proposes a decentralized framework combining Ethereum smart contracts, IPFS, and perceptual hashing for automated video copyright verification. Achieves 409.87 TPS for registration and 484.23 TPS for verification, providing practical throughput benchmarks directly comparable to the thesis's own performance evaluation. Demonstrates that on-chain copyright operations can meet production-level demands.

80. **Wang, Z., Feng, W., Huang, M., Feng, S., Mo, S., & Li, Y. (2025)**. Blockchain-based information security protection mechanism for the traceability of intellectual property transactions. *Sensors, 25*(10), 3064. https://pmc.ncbi.nlm.nih.gov/articles/PMC12115280/

    **Annotation:** Introduces a BLS threshold signature scheme with dynamic DKG protocol for IP transaction traceability, embedding W3C PROV data model for judicially admissible evidence chains. Signature aggregation achieves 40ms vs. 180ms for conventional RSA multi-signature. Relevant for understanding on-chain IP verification performance and legal compliance patterns.

81. **Information (MDPI). (2026)**. Library systems and digital-rights management: Towards a blockchain-based solution for enhanced privacy and security. *Information, 17*(2), 137. https://www.mdpi.com/2078-2489/17/2/137

    **Annotation:** Proposes a decentralized DRM framework for library systems using IPFS for content storage and blockchain smart contracts for DRM-key generation, distribution, and validation. Published February 2026, represents the most recent academic work on blockchain-based DRM and validates the thesis's approach of combining distributed storage with on-chain access control.

#### Cross-Chain Interoperability and Polkadot

21. **Abbas, H., et al. (2022)**. Analysis of Polkadot: Architecture, Internals, and Contradictions. https://www.cri-lab.net/wp-content/uploads/2022/07/IEEE_Blockchain_2022__Polkadot_Architecture___Limitations.pdf  
    
    **Annotation:** This paper provides the first systematic examination of the Polkadot environment, offering a comprehensive analysis of its protocols, governance structure, and economic model. It identifies several limitations—supported by empirical analysis of its ledger—that could substantially affect the network's scalability and overall security.

22. **TokenInsight Research. (2021)**. 2021 Polkadot Ecosystem Research Report. https://downloads.coindesk.com/research/2021-Polkadot-Ecosystem-Research-Report.pdf  
    
    **Annotation:** Projects within the Polkadot ecosystem primarily encompass decentralized finance (DeFi) initiatives aimed at fostering ecosystem expansion, liquidity staking, and development tools. Additionally, it endorses infrastructure projects pertaining to data management, privacy, and cross-chain solutions. This report outlines principal projects categorized by sector.

23. **Moreno, M.F., et al. (2023)**. A Knowledge-Oriented Approach to Enhance Integration... https://arxiv.org/pdf/2308.00735  
    
    **Annotation:** The Polkadot ecosystem has a complex multi-chain architecture that challenges data analysis and communication. This document presents a framework using a domain ontology called POnto (Polkadot Ontology) to address these issues. It also describes a case study approach to validate the framework, incorporating expert feedback and insights from the Polkadot community.

24. **Zhou1, Q., et al. (2021)**. A Study on Blockchain Interoperability Mechanism. https://www.aasmr.org/jsms/Vol11/vol.11.4.7.pdf  
    
    **Annotation:** This paper presents a cross-chain framework based on modularity, abstraction, and layering, separating cross-chain functions from consensus and app logic. It uses Merkle proofs to verify cross-chain activities. Homogeneous and heterogeneous blockchains are addressed separately due to their differences. 

25. **Valaštín V., et al. (2024)**. Protocol for Unifying Cross-Chain Liquidity on Polkadot. https://pdfs.semanticscholar.org/5152/064e23fb989674640caaa438495dbb83a88c.pdf  

    **Annotation:** This paper introduces LiquiSpell, a protocol designed to unify liquidity across Polkadot parachains. Using cross-chain message passing (XCMP), it creates a universal transaction that is compatible with any parachain, regardless of its architecture or asset management. This addresses the heterogeneity of parachains, enabling seamless asset sharing and better cross-chain interoperability.

26. **Mao, H., et al. (2022)**. A Survey on Cross-Chain Technology: Challenges, Development, and Prospect. https://www.researchgate.net/publication/366226788  
    
    **Annotation:** This paper analyzes methodologies based on technical approaches, security needs, and limitations, comparing their applicability. It discusses the challenges public and consortium blockchains face in implementing cross-chain tech and reviews current solutions. It introduces eight key projects and explores future developments. The paper finally highlights research directions and trends in cross-chain technology.

27. **Sevim H.O. (2024)**. A Survey on Trustless Cross-chain Interoperability Solutions in On-chain Finance. https://dlt2024.di.unito.it/wp-content/uploads/2024/05/DLT2024_paper_14.pdf  
    
    **Annotation:** This document analyzes core principles, recent advancements, and key cross-chain interoperability protocols like LayerZero, Wormhole, Chainlink, Circle, Polkadot, and Cosmos. It reviews their design, mechanisms, consensus, and limitations. Also, it proposes simple metrics for future studies on performance and compatibility.

28. **Kraken Intelligence. (2021)**. Polkadot & Kusama Parachains Primer. https://cognizium.io/uploads/resources/Kraken%2520Intelligence%2520-%2520Polkadot%2520and%2520Kusama%2520Parachains%2520Primer%2520-%25202021%2520Sep.pdf  
    
    **Annotation:** This report explores Polkadot, Kusama, and parachain auctions in cryptoassets. It highlights their strategic importance, impact on future crypto, and their role as the foundation of the 'internet of blockchains.' It also guides on participating in auctions and understanding parachains' potential.

29. **Abdul, S. S. M., et al. (2024)**. CrossDeFi: A Novel Cross-Chain Communication Protocol. https://research.usq.edu.au/download/2db986086d8a09d3c5b40bff343fcd0d8731bc38a84f5101bfd5269dfde1f089/1117226/futureinternet-16-00314.pdf  
    
    **Annotation:** This document introduces CrossDeFi, a cross-chain communication protocol designed to address challenges from diverse consensus mechanisms, smart contracts, and token systems. It features Miner and Bridge Selection (MBS) and Enhanced Transfer Confirmation (ITC). The findings highlight its transformative role in decentralized finance. 

30. **Xie R., Tang M. (2024)**. A digital resource copyright protection scheme based on blockchain cross-chain technology. (Heliyon). https://www.cell.com/heliyon/pdf/S2405-8440%2824%2912861-7.pdf  
    
    **Annotation:** This paper outlines a framework for copyright registration, transactions, modifications, and enforcement, with an analysis of its effectiveness. It finds that blockchain cross-chain technology is well-suited for digital copyright protection. This framework enables stakeholders to perform their roles effectively, improving blockchain system scalability and maintainability.

31. **Mareckova, D. (2024)**. Blockchain and Collective Rights Management of Copyright and Related Rights at the Global Level: The Case of the Music Industry. https://library.oapen.org/bitstream/handle/20.500.12657/94575/oa_pdf-057-1731486746.pdf  
    
    **Annotation:** This thesis offers a theoretical framework to understand blockchain's impact, often missing in legal copyright literature. Chapter 1 examines the history of copyright and rights management to assess whether blockchain challenges legal principles. Chapter 2 discusses the nature and potential of blockchain in copyright and rights management. Chapter 3 introduces Luhmann's systems theory to analyze the effect of blockchain, leading to the final chapter that summarizes key findings.

32. **Yin, Z., et al. (2022)**. Bool Network: An Open, Distributed, Secure Cross-chain Notary Platform. https://eprint.iacr.org/2022/1290.pdf  
    
    **Annotation:** This paper examines notary-based cross-chain solutions that provide the highest levels of compatibility and user-friendliness; however, these solutions are generally characterized by centralization. To mitigate this issue, the Bool Network has been introduced as an open, distributed, and secure cross-chain notary platform powered by Multi-Party Computation (MPC)-based distributed key management over dynamic hidden committees. 

33. **Orero, P. et al. (2023)**. The Visible Subtitler: Blockchain Technology for Right Management and Minting. https://open-research-europe.ec.europa.eu/articles/3-26/pdf  
    
    **Annotation:** The paper offers a comprehensive overview of subtitle copyright issues, followed by a detailed analysis of both centralized and decentralized copyright management systems. It also explores the potential application of blockchain technology to facilitate the identification of subtitlers. Moreover, a focus group comprising expert professional subtitlers was convened, and their feedback has been thoroughly documented.

34. **Munson, M., et al. (2022)**. Blockchain Content Fabric for Multi-Chain Content Ownership and Distribution. https://eluv.io/3e39198441b1d578bc0f.pdf  
    
    **Annotation:** This paper aims to outline the core design principles of the Content Fabric Protocol (CFP) from both content and blockchain perspectives and introduce an innovative on-chain and cross-chain system for verifying ownership and authorization in decentralized content sharing through digital tokens. 

35. **Chen, K., et al. (2023)**. A Trusted Reputation Management Scheme for Cross-Chain Transactions. https://orbit.dtu.dk/files/330353284/sensors_23_06033.pdf  
    
    **Annotation:** This study offers a reputation management mechanism based on nodes' transaction history. It assesses reputation for quick detection of malicious activity. To enhance accuracy and flexibility, Particle Swarm Optimization (PSO) is integrated, supporting various blockchain platforms. The paper emphasizes the importance of securing cross-chain transactions and presents a method to prevent misconduct through reputation monitoring.

36. **Tao, R. (2025)**. The Study of Blockchain Technology for Copyright Protection and Resource Sharing Models in Library Digital Resources. http://www.issplc.com/api/detail/journalDetail/id/3968  
    
    **Annotation:** This paper examines blockchain's potential in libraries for protecting digital copyrights and resource sharing. Its decentralized ledger can create secure, transparent, and automated systems for digital rights management, ensuring fair pay for authors. The paper also addresses challenges such as scalability, privacy, and legal issues. It suggests that tech advances will enhance security, efficiency, and transparency in digital resource management in libraries.

37. **Buzu, I. (2021)**. Blockchain, smart contracts and copyright management disruption. https://papers.ssrn.com/sol3/Delivery.cfm/SSRN_ID3759260_code3591422.pdf  
    
    **Annotation:** This paper examines the relationship between blockchain technology and copyright law, utilizing international copyright law as the analytical framework.

82. **Deng, Z., Tang, C., Li, T., Abla, P., Chen, Q., Liang, W., & He, D. (2025)**. Enhancing Blockchain Cross-Chain Interoperability: A Comprehensive Survey. arXiv:2505.04934. https://arxiv.org/abs/2505.04934

    **Annotation:** Systematically analyzes 150+ sources covering atomic swaps, sidechains, light clients, and relay chains. Provides the most comprehensive recent classification of interoperability approaches and maps academic research to industry implementations. Essential for positioning the thesis's XCM-based approach within the broader cross-chain landscape.

83. **Li, W., Liu, Z., Chen, J., Liu, Z., & He, Q. (2025)**. Towards blockchain interoperability: a comprehensive survey on cross-chain solutions. *Blockchain: Research and Applications, 6*(3), 100286. https://www.sciencedirect.com/science/article/pii/S2096720925000132

    **Annotation:** Distinguishes between asset interoperability and data interoperability, providing a hierarchical architecture for analyzing cross-chain solutions. Useful for framing the thesis's distinction between cross-chain rights transfer (asset) vs. cross-chain rights verification (data).

84. **Maric, F., Scholz, B., & Subotic, P. (2025)**. Formal Verification of a Fail-Safe Cross-Chain Bridge. In *6th International Workshop on Formal Methods for Blockchains (FMBC 2025)*, OASIcs vol. 129. https://drops.dagstuhl.de/entities/document/10.4230/OASIcs.FMBC.2025.8

    **Annotation:** Uses Isabelle/HOL proof assistant to formally verify a fail-safe bridge design that maintains token equilibrium across chains during failures. Directly relevant to Snowbridge security arguments and the thesis's bridge architecture analysis. Advances the state of the art in mathematically proven bridge safety properties.

85. **Snowfork. (2025)**. Snowbridge V2 Is Live! *Polkadot Forum*, November 7, 2025. https://forum.polkadot.network/t/snowbridge-v2-is-live/15844

    **Annotation:** Snowbridge V2 launched with arbitrary Ethereum contract calls from Polkadot, 50% fee reduction (Eth->DOT ~$0.50, DOT->Eth ~$1.00), unordered message execution, and transfer time reduced from ~60 to ~35 minutes via Beefy Pipelining. Reached $75M TVL. Critical primary source for the thesis's Ethereum-Polkadot bridge evaluation, marking the transition from experimental to production infrastructure.

86. **Snowfork. (2025)**. Snowbridge 2025/2026 Stabilized. *Polkassembly Proposal #3313*. https://polkadot.polkassembly.io/post/3313

    **Annotation:** Details the $2.8M funded roadmap for 2025/2026 stabilization including optimized light client, stablecoin support, and L2 connectivity. Documents over one year of operation with zero on-chain downtime. Provides governance and sustainability context for the thesis's bridge reliability claims.

#### Decentralized Monetization Models (Subscription, PPV, Purchase)

38. **Zheng, H., et al. (2024)**. Decentagram: Highly-Available Decentralized Publish/Subscribe Systems. https://owenarden.github.io/home/papers/decentagram.pdf  
    
    **Annotation:** This paper presents Decentagram, a decentralized framework designed for data dissemination that adopts the publish/subscribe messaging paradigm. Decentagram utilizes blockchain smart contracts to verify events published via digital signatures or self-attestation certificates generated within trusted execution environments (TEEs), both of which are validated on-chain.

39. **Osemwegie, O. (2025)**. Decentralized Media Distribution: Exploring blockchain's role in copyright protection, monetization, and content ownership rights. https://www.mechanicaljournals.com/ijmtme/article/52/6-1-1-964.pdf  
    
    **Annotation:** This paper examines blockchain's role in decentralized media, showing how cryptographic hashing and timestamping ensure copyright, authenticity, and ownership. It explores monetization methods like micropayments and tokenization that enable creators' peer-to-peer transactions without intermediaries. The study also discusses challenges like scalability, regulations, and adoption barriers in blockchain media systems.

40. **Virovets, D., et al. (2025)**. A Framework for Decentralized Payment Instrument Integration with Artificial Intelligence, Big Data, and Digital Identities. https://ceur-ws.org/Vol-3991/paper33.pdf  
    
    **Annotation:** This study aims to analyze the technological challenges and opportunities associated with integrating decentralized payment instruments with other information and communication technologies. Furthermore, it intends to propose strategies for effectively leveraging modern decentralized payment instruments.

41. **Zeggari, M., et al. (2022)**. An Efficient and Decentralized Blockchain-based Commercial Alternative. https://eprint.iacr.org/2022/1440.pdf  
    
    **Annotation:** This document introduces Lyzis Labs, an incentive-driven, decentralized protocol for a blockchain-based online marketplace. The Lyzis Marketplace connects parties securely without a Trusted Third Party (TTP), ensuring transparent, protected data storage.

42. **Baliga, A.. (2020)**. Understanding Blockchain Consensus Models. https://www.persistent.com/wp-content/uploads/2017/04/WP-Understanding-Blockchain-Consensus-Models.pdf  
    
    **Annotation:** This white paper provides an overview of consensus models adopted by popular blockchain platforms and analyzes their merits and demerits.

43. **Li, L., et al. (2024)**. Why Blockchain-Based Digital Assets Are Owned on Decentralized Metaverse Platforms? https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/da7d3ba9-379e-48a8-98e8-18b2bc293b1f/content  
    
    **Annotation:** This research examines ownership of blockchain-based digital assets within a decentralized metaverse platform, facilitated by Web3 and built upon blockchain technology. Applying the dual-process model of psychological ownership, the study examines the factors that influence individuals' desire for ownership in this environment. 

44. **Atzori, M.. (2017)**. BLOCKCHAIN TECHNOLOGY AND DECENTRALIZED... https://virtusinterpress.org/IMG/pdf/10.22495_jgr_v6_i1_p5.pdf  
    
    **Annotation:** Redesigning interactions. Politics/business applications; community focus.

45. **Busch, K. (2022)**. Web3: A Proposed Blockchain-Based, Decentralized Web. https://www.congress.gov/crs_external_products/IF/PDF/IF12075/IF12075.2.pdf  
    
    **Annotation:** This paper reviews web architecture and Web3 app development. The internet has multiple layers, from hardware to user applications. It focuses on Web3 at the application layer, where most users access online content and services. 

46. **Gogel, D., et al. (2021)**. DeFi Beyond the Hype: The Emerging World of Decentralized Finance. https://wifpr.wharton.upenn.edu/wp-content/uploads/2021/05/DeFi-Beyond-the-Hype.pdf  
    
    **Annotation:** The purpose of this report is to explain the concept of DeFi, outlining its main features, the architecture of the DeFi ecosystem, and prospective developments.

47. **Khan, K. (2024)**. Decentralized Video Streaming: Unleashing the Potential through Blockchain-Powered Platforms. http://ijmrap.com/wp-content/uploads/2024/01/IJMRAP-V6N7P97Y23.pdf  
    
    **Annotation:** This paper examines the paradigm shift toward decentralized video platforms, driven by blockchain technology. It assesses the core principles of decentralized video streaming, highlighting the potential benefits for content creators, users, and the broader streaming ecosystem. 

48. **Gomaa, A.. (2019)**. A DRM Solution for Online Content Using Blockchain - A Music Perspective. https://personales.upv.es/thinkmind/dl/conferences/infocomp/infocomp_2019/infocomp_2019_1_30_60048.pdf  
    
    **Annotation:** This document proposes a DRM framework to monetize, monitor, and regulate digital content across platforms. It aims to reduce entry barriers for musical groups, facilitate royalty distributions, and control content dissemination. The paper leverages recent advancements in blockchain and cryptocurrency. 

49. **Castweet Team. (2019)**. Castweet - A Multi-broadcast Platform Based on Blockchain Incentives for Everyone. https://resources.cryptocompare.com/asset-management/17402/1728919640132.pdf  
    
    **Annotation:** This paper reviews the Castweet Ecosystem, which promotes sustainable engagement by showcasing use cases for viewers and creators. Many blockchain incentive systems focus on rewards, enabling earning but neglecting genuine token use cases. 

50. **Banerjee, P., et al. (2020)**. Reliable, Fair and Decentralized Marketplace for Content Sharing Using Blockchain. https://arxiv.org/pdf/2009.11033  
    
    **Annotation:** This paper proposes a dependable and equitable platform for content sharing that functions without a central intermediary. The platform is designed as a decentralized data storage layer aimed at securely storing and distributing content in a fault-tolerant manner, with peers also participating within a blockchain network. 

51. **Munson, M.. (2019)**. A Blockchain Controlled Content Fabric. https://static.vsf.tv/Meetings/2019/2019_DC/Munson_BlockchainFabric.pdf  
    
    **Annotation:** Content fabric with PPV/subscriptions. Regional dynamic content.

52. **Steem Team. (2025)**. Steem, an incentivized, blockchain-based, public content platform. https://steem.com/SteemWhitePaper.pdf  
    
    **Annotation:** This paper documents Steem, which aims to support social media and online communities by returning a significant portion of its value to contributors through cryptocurrency rewards. This approach enables the creation of a currency that can reach a broad market, including individuals who have not yet engaged with the cryptocurrency economy.

53. **Shah, A.. (2025)**. Automating Royalties: A Framework of Smart Contracts for Cross-Platform Content Revenue. https://www.ijfmr.com/papers/2025/4/51619.pdf  
    
    **Annotation:** This paper presents a blockchain-based framework using smart contracts to streamline royalty distributions, ensuring transparency, efficiency, and fairness for content creators. It examines the smart contract architecture, evaluates its financial aspects, and highlights its potential to transform content monetization. The paper also explores the mathematical models behind royalty calculations and the interdisciplinary integration of computer science, mathematics, and economics. 

54. **Wamugo, M.. (2024)**. Content monetization: non-fungible tokens as a new revenue stream for the media sector in Kenya. https://ecommons.aku.edu/cgi/viewcontent.cgi?article=3232&context=theses_dissertations  
    
    **Annotation:** This study explores NFTs as an alternative revenue source for Kenyan media outlets, using mixed methods. It aims to identify opportunities, challenges, and the potential role of this stream in supporting media with authentic content. 

55. **Moncada, R., et al. (2021)**. DLT-enabled Platforms: Distribution and Management of Media Content. https://mediaverse-project.eu/wp-content/uploads/2021/09/Research-Note-Blockchain-based-Platforms_integrated.pdf  
    
    **Annotation:** This is an analysis of DLT-enabled platforms for the distribution and management of media content. 

87. **360iResearch. (2025)**. Blockchain for Content Monetization Market Size 2025-2030. Market Research Report. https://www.360iresearch.com/library/intelligence/blockchain-for-content-monetization

    **Annotation:** Market grew from $499.52M (2024) to $659.32M (2025), projected to reach $2.74B by 2030 at 32.78% CAGR. Segmented by monetization model including subscription-based, pay-per-view, ad-based revenue sharing, and tokenized content ecosystems. Provides the most granular market sizing for blockchain-specific content monetization, directly supporting the thesis's economic rationale.

88. **CommuniPass. (2026)**. Creator Monetization in 2026: The 5 Models That Actually Generate Recurring Revenue. https://communipass.com/blog/creator-monetization-in-2026-the-5-models-that-actually-generate-recurring-revenues/

    **Annotation:** Industry analysis of creator economy monetization models in 2026, covering token-gated access, on-chain subscriptions, and micropayment channels. The creator economy projected to exceed $280B by end of 2026. Useful supporting context for the thesis's subscription and PPV monetization models within the broader creator economy landscape.

89. **Coinbase / x402 Foundation. (2025)**. x402 Protocol: HTTP-native blockchain micropayments. https://coinpaprika.com/education/x402-ecosystem-instant-blockchain-payments-for-apis-and-ai-agents/

    **Annotation:** Coinbase launched x402 protocol enabling service providers to embed payment logic directly into HTTP responses, with Cloudflare as founding member. Payments settle in under 2 seconds using stablecoins. Represents a significant shift toward protocol-level micropayment integration, demonstrating industry momentum toward the type of low-friction pay-per-view model the thesis proposes.

#### NFTs and IP Rights

56. **USPTO. (2024)**. Non-Fungible Tokens and Intellectual Property: A report to Congress. https://www.copyright.gov/policy/nft-study/Joint-USPTO-USCO-Report-on-NFTs-and-Intellectual-Property.pdf  
    
    **Annotation:** This paper examines the legal and policy implications of intellectual property rights in relation to NFTs, which are part of a burgeoning tech field utilizing blockchain across various applications. Many applications, such as proving ownership of digital art or authenticating products and services, inherently involve IP rights.

57. **Davik, C. (2025)**. The Art Of NFTs: Copyright, Contracts, And The Fallacy Of Ownership. https://georgialawreview.org/wp-content/uploads/2025/01/Davik_The-Art-of-NFTs.pdf  
    
    **Annotation:** This article advocates for greater transparency in the NFT marketplace, enabling consumers to understand their rights regarding the artwork clearly. Transparency helps prevent dissatisfaction and legal issues, such as copyright infringement. Buyers need to know if reproducing, distributing, or exploiting the work is allowed to assess the true cost of an NFT.

58. **Salman, B., et al. (2023)**. NFT-Based Secure Platform for Copyright Images[NFT-SPCI]. https://tijer.org/tijer/papers/TIJER2307069.pdf  
    
    **Annotation:** This paper proposes a blockchain-based platform utilizing NFTs, whereby digital artists can generate an NFT for their artwork to establish ownership, authenticity, and copyright rights without difficulty, as well as commercialize their art using cryptocurrencies.

59. **Eurojust. (2024)**. Non-Fungible Tokens and Intellectual Property Rights - Can the use of NTFs lead to IP infringements? https://www.eurojust.europa.eu/sites/default/files/assets/eurojust-nfts-intellectual-property-rights-flyer.pdf  
    
    **Annotation:** This flyer highlights the increasing adoption of non-fungible tokens (NFTs) within the art industry and provides an analysis of the implications for copyright and trademark rights. Additionally, it offers an overview of recent judicial decisions that impact this evolving domain, which presently lacks a comprehensive legal regulatory framework.

60. **Darshan, P., et al. (2025)**. Intellectual Property Rights and Entrepreneurship in the NFT Ecosystem: Legal Frameworks, Business Models, and Innovation Opportunities. https://www.arxiv.org/pdf/2507.00172  
    
    **Annotation:** This paper examines the gap between traditional copyright law and blockchain transactions. Using a mixed-methods approach, it develops an intellectual property rights matrix to show the link between copyright law and NFT ownership. The research suggests solutions like standardized licensing, rights management, and compliance guidelines.

61. **Murray, M.. (2022)**. NFT Ownership And Copyrights. https://mckinneylaw.iu.edu/practice/law-reviews/ilr/pdf/vol56p367.pdf  
    
    **Annotation:** This paper aims to educate diverse audiences and provide clarity on copyright issues within the realm of NFTs and blockchain technology.

62. **Dreyer, A., et al. (2021)**. Can I mint an NFT with that?: Avoiding right of publicity and trademark litigation risks in the brave new world of NFTs. https://www.skadden.com/-/media/files/publications/2021/05/canimintannftwiththatavoidingrightofpublicityandtr.pdf  
    
    **Annotation:** This article examines how NFTs could implicate rights across various categories of IP. It discusses the extent to which existing commercial license agreements granting rights in those categories may — or may not — permit the creation and sale of NFTs.

63. **Gatto, J., et al. (2021)**. NFT License Breakdown: Exploring Different Marketplaces and Associated License Issues. https://www.lawoftheledger.com/wp-content/uploads/sites/15/2021/09/NFT-License-Breakdown-Article-0921.pdf  
    
    **Annotation:** This article will explain some distinctions among these types of marketplaces, highlight various licensing terms associated with them, and discuss why intellectual property (IP) owners who license their IP for non-fungible tokens (NFTs) are often best advised to develop their own licensing agreements to facilitate the sale of their NFTs.

64. **Reggianini, E. (2025)**. Standardizing On-chain IP Rights Management. https://blockstand.eu/blockstand/uploads/2025/05/Standardizing-On-chain-IP-Rights-Management_Reggianini.pdf  
    
    **Annotation:** This paper reviews a framework for standardized NFT licensing processes, licensee rights, and royalty distribution under European standards. Unlike Web2, where copyright enforcement and royalties can be burdensome and opaque, our Web3 approach utilizes blockchain and smart contracts for transparency, efficiency, and a creator-focused system.

90. **Story Foundation. (2025)**. Story Mainnet Launch. *CoinDesk*, February 13, 2025. https://www.coindesk.com/tech/2025/02/13/story-protocol-launches-to-let-people-to-register-ip-and-get-paid-for-it/

    **Annotation:** Story Protocol launched as the first dedicated IP Layer-1 blockchain (Cosmos SDK + EVM), with $140M total funding (a16z-led $80M Series B). Enables programmable IP registration, automated licensing via smart contracts, and on-chain royalty distribution. Directly relevant as a competitor/comparator to the thesis's Polkadot-based approach — validates market demand while using a fundamentally different architecture (single-chain EVM vs. cross-chain XCM).

91. **Li, Q., Wen, X., & Wu, Z. (2025)**. Evaluating blockchain adoption barriers in China's IP trade and protection internationally. *Frontiers in Blockchain, 8*. https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2025.1608181/full

    **Annotation:** Applies AHP methodology to rank blockchain adoption barriers in IP trade. Regulatory barriers (compliance costs weighted 0.308) outrank technological barriers (infrastructure 0.198). Provides quantitative evidence for the thesis's discussion of adoption challenges, demonstrating that regulatory uncertainty poses a greater obstacle than technical limitations for on-chain IP management.

#### Smart Contracts and Digital Content

65. **Shumyliak, L., et al. (2023**). Practical Implementation of Smart Contracts for Payment of Digital Goods. https://ceur-ws.org/Vol-3373/short1.pdf  
    
    **Annotation:** This article discusses the implementation of smart contracts, highlighting benefits such as increased security, transparency, reduced transaction costs, and automated contractual processes. It covers core components, deployment in digital goods markets, and the system's operational algorithm.

66. **Smart Contracts Alliance. (2016)**. Smart Contracts: 12 Use Cases for Business & Beyond. https://d3h0qzni6h08fz.cloudfront.net/Smart-Contracts-12-Use-Cases-for-Business-and-Beyond_Chamber-of-Digital-Commerce.pdf  
    
    **Annotation:** Use cases including assets. Acceptance promotion; blockchain tech.

67. **Quan, L., et al. (2024)**. Research and application of digital Collection smart Contract Method based on Blockchain. https://www.atlantis-press.com/article/125999556.pdf  
    
    **Annotation:** This paper explores blockchain and smart contract technologies, proposing an NFT communication and management platform. The platform aims to ensure transparency, immutability, and support the growth of the digital art industry.

68. **Upadhyay, K., et al. (2021)**. Paradigm Shift from Paper Contracts to Smart Contracts. https://engineering.unt.edu/cse/research/labs/nsl/sites/default/files/biblio/documents/paradigm_shift_from_paper_contracts_to_smart_contracts.pdf  
    
    **Annotation:** This paper provides an overview of the shift from traditional paper contracts to smart contracts. It emphasizes the need for smart contracts to be legally enforceable and outlines criteria for their validity. It also discusses recent trends and emerging technologies—such as Natural Language Processing, Machine Learning, and the Internet of Things—that are being integrated into smart contracts.

69. **Feng, T., et al. (2019)**. Smart contract model for complex reality transaction. https://file.sciopen.com/sciopen_public/1492758728785117186.pdf  
    
    **Annotation:** This paper proposes a novel smart contract model to address the issues of high cost, limited applicability to specific scenarios, and inefficiency. Subsequently, the advantages and deployment strategies of smart contracts are explored.

70. **Smart Contracts Alliance. (2018)**. Smart Contracts: Is the Law Ready? https://lowellmilkeninstitute.law.ucla.edu/wp-content/uploads/2018/08/Smart-Contracts-Whitepaper.pdf  
    
    **Annotation:** This white paper aims to disseminate a comprehensive understanding of the nature of smart contracts, their potential applications, and their integration into existing legal frameworks. 

71. **Cutts, T. (2019)**. Smart Contracts and Consumers. https://researchrepository.wvu.edu/cgi/viewcontent.cgi?article=5358&context=wvlr  
    
    **Annotation:** This paper explains the concept of "smart contracts" and delineates how they differ from existing commercial tools. It also examines whether smart contracting, on balance, provides a superior method for facilitating valuable commitments.  

72. **Kulkarani, S., et al. (2024)**. Blockchain Enabled Smart Contracts for Digital Assets. https://ijarsct.co.in/Paper15404.pdf  
    
    **Annotation:** This overview explores the uses and benefits of blockchain and smart contracts across sectors such as DeFi, supply chains, asset tokenization, NFTs, and identity verification. Smart contracts are valued for cost savings and security, with blockchain's cryptography improving system integrity. 

73. **Mauro, N. (2022)**. Smart contracts for decentralized business models in the electricity market: a consumer protection perspective. https://emle.org/wp-content/uploads/2023/01/EMLE_thesis_Mauro_Noemi.pdf  
    
    **Annotation:** This research explores smart contracting in P2P electricity trading, with a focus on consumers. It evaluates smart contracts and blockchain from legal and economic views, especially their potential to lower negotiation costs. A brief overview of the electricity market's features and challenges is included. The study concludes by discussing the implications of smart contracts for consumers. 

74. **Zheng, Z., et al. (2019)**. An Overview on Smart Contracts: Challenges, Advances and Platforms. https://arxiv.org/pdf/1912.10370  
    
    **Annotation:** This report offers a comprehensive overview of smart contracts, starting with blockchain technology and the concept of smart contracts. It discusses challenges, recent advancements, compares major platforms, and categorizes applications with examples.

92. **ink! Alliance. (2026)**. Discontinuation of ink: Rust smart contract language. *Polkadot Forum*, January 27, 2026. https://forum.polkadot.network/t/discontinuation-of-ink-rust-smart-contract-language/16849

    **Annotation:** ink! development officially discontinued due to inability to secure funding after three rejected OpenGov treasury proposals. W3F and Parity declined to fund ink! as strategically necessary. Alternatives include low-level Rust via pallet-revive, Solidity rewrite, or community-maintained wrevive SDK. Critical development for the thesis, which uses ink! 6 — the implementation remains valid as proof-of-concept but production deployment would require migration.

93. **Buterin, V. (2025)**. Long term L1 execution layer proposal: replace the EVM with RISC-V. *Ethereum Magicians Forum*, April 20, 2025. https://www.coindesk.com/tech/2025/04/21/vitalik-buterin-proposes-replacing-ethereums-evm-with-risc-v

    **Annotation:** Buterin proposed replacing the EVM with RISC-V architecture, citing potential 100x efficiency gains via three-stage deployment. Validates Polkadot's early move to PolkaVM/RISC-V and suggests industry convergence toward this architecture. Strengthens the thesis's technology choice even as ink! is discontinued, since the underlying PolkaVM execution environment has broader ecosystem validation.

94. **R0GUE. (2025)**. ink! speaks Solidity on PolkaVM. *Medium*, August 2025. https://r0gue.medium.com/ink-solidity-abi-on-polkavm-c675c854efd3

    **Annotation:** Documents ink! achieving Solidity ABI compatibility on PolkaVM, enabling interoperability between Rust and Solidity smart contracts on pallet-revive. Relevant to the thesis's smart contract implementation as it demonstrates a migration path: existing ink! contracts can interact with Solidity contracts deployed on the same PolkaVM infrastructure.

#### Decentralized Content Distribution Networks

75. **Goyal, P., et al. (2019)**. Secure Incentivization for Decentralized Content Delivery. https://www.usenix.org/system/files/hotedge19-paper-goyal_0.pdf  
    
    **Annotation:** This paper examines the effectiveness of monetary incentives in P2P content delivery systems. It introduces Gringotts, a secure transaction system with an innovative Proof of Delivery to confirm file delivery. Gringotts uses cryptocurrency for payments, safeguarding against dishonesty and Sybil attacks. 

76. **MarketsandMarkets. (2025, July)**. Digital Rights Management Market by Application. https://www.marketsandmarkets.com/Market-Reports/digital-rights-management-market-152806525.html 

    **Annotation:** The global Digital Rights Management (DRM) market is projected to reach USD 6.72 billion in 2025 and is expected to expand to USD 11.05 billion by 2030, with a compound annual growth rate (CAGR) of 10.5%. Key factors driving this growth include the expansion of streaming services, the proliferation of OTT platforms, emerging threats from AI-enabled piracy, and the increasing demand for sophisticated content protection and monetization solutions in media/entertainment.

77. **Grand View Research. (2025)**. Digital Rights Management Market Size, Share & Trends Analysis Report. https://www.grandviewresearch.com/industry-analysis/digital-rights-management-market 

    **Annotation:** Estimates the DRM market at USD 6.16 billion in 2024, reaching USD 6.72 billion in 2025 and USD 14.48 billion by 2033 (CAGR 10.1% from 2025). Emphasizes growth from digital content proliferation, streaming services, and the imperative for low-intermediary-fee alternatives to centralized models.

78. **Mordor Intelligence. (2026, January)**. Digital Rights Management (DRM) Market - Size, Share & Industry Analysis. https://www.mordorintelligence.com/industry-reports/digital-rights-management-drm-market

    **Annotation:** Provides updated market sizing: USD 6.23 billion in 2025, USD 6.93 billion in 2026, increasing to USD 11.76 billion by 2031 (CAGR 11.16%). Highlights key drivers including OTT subscriptions, AI-driven piracy threats, regulatory mandates, and the transition to cloud-based and multi-DRM solutions.

#### Polkadot Ecosystem Evolution (New Section)

95. **Wood, G. (2024, updated through 2025)**. JAM: The Join-Accumulate Machine (Gray Paper). Version 0.7.1+. https://wiki.polkadot.com/learn/learn-jam-chain/

    **Annotation:** Formal specification of JAM as relay chain successor, combining elements of Polkadot and Ethereum into a global singleton permissionless object environment with parallelized sideband computation. JAM Testnet launched January 2026 with RISC-V support; mainnet targeted early-to-mid 2026. 43 implementation teams competing for 10M DOT prize. Critical for the thesis's forward-looking architecture analysis as JAM will eventually replace the relay chain infrastructure the thesis builds upon.

96. **Parity Technologies. (2025)**. Polkadot Upgrade 2025: What You Need to Know. https://www.parity.io/blog/polkadot-upgrade-2025-what-you-need-to-know

    **Annotation:** Official announcement of Polkadot 2.0 completion with Async Backing, Agile Coretime, and Elastic Scaling all live. Elastic Scaling launched October 2025 as the final piece. Parachains achieve 2-second latency with 3 cores, projected 500ms with 12 cores. XCM v5 included with multi-hop transactions and improved error handling. Essential primary source — the thesis should reference Polkadot 2.0 as delivered production capability, not a roadmap item.

97. **Polkadot Network. (2025)**. Polkadot Roundup 2025. *Medium*. https://medium.com/polkadot-network/polkadot-roundup-2025-3c3c71c7e9c4

    **Annotation:** Year-end retrospective covering the full delivery of Polkadot 2.0, PolkaVM deployment on Westend (Kusama Q2/25, Polkadot Q3/25), and the Plaza vision for smart contracts on Polkadot Hub. Provides ecosystem-wide context for the thesis's technology choices and deployment environment.

#### Regulatory Landscape (New Section)

98. **Guadamuz, A. (2025)**. The EU's Artificial Intelligence Act and copyright. *The Journal of World Intellectual Property, 28*, 213-219. https://onlinelibrary.wiley.com/doi/10.1111/jwip.12330

    **Annotation:** Analyzes the EU AI Act's copyright provisions, particularly the text-and-data-mining transparency obligations for general-purpose AI models effective August 2025. Relevant to the thesis's regulatory context as it intersects blockchain-based DRM with emerging AI copyright frameworks — on-chain provenance systems could serve as compliance infrastructure for AI training data rights verification.

99. **European Parliament. (2026)**. Report on copyright and generative artificial intelligence — opportunities and challenges. A10-0019/2026. https://www.europarl.europa.eu/doceo/document/A-10-2026-0019_EN.html

    **Annotation:** Parliamentary report proposing enhanced licensing/remuneration regime for AI training data, with January 2026 committee vote. Signals strong regulatory demand for the type of on-chain rights provenance and automated licensing system the thesis proposes, potentially creating a new use case for cross-chain content rights management beyond traditional media consumption.

100. **European Securities and Markets Authority. (2025)**. MiCA Regulation: Markets in Crypto-Assets. Full enforcement by July 2026. https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica

     **Annotation:** NFTs explicitly excluded from MiCA scope unless marketed as fungible/fractional. Full CASP compliance required by July 2026. Important for the thesis's token classification analysis — rights tokens may fall outside MiCA if truly non-fungible, but subscription tokens with fungible characteristics (e.g., interchangeable 30-day access passes) could require compliance under the substance-over-form principle.

101. **Xie, R. & Tang, M. (2024)**. A digital resource copyright protection scheme based on blockchain cross-chain technology. *Heliyon, 10*(17), e36830. https://www.sciencedirect.com/science/article/pii/S2405844024128617

     **Annotation:** An extended version of the earlier Heliyon publication (entry 16/30), proposing a cross-chain blockchain framework for copyright protection in digital publishing that addresses scalability and multi-stakeholder coordination. Provides additional implementation detail relevant to the thesis's cross-chain rights management design.

102. **Darshan, P., Rohan, J. S., Rajesh, R., Ruchitha, M., Kamath, S., & Manas, M. N. (2025)**. Intellectual Property Rights and Entrepreneurship in the NFT Ecosystem: Legal Frameworks, Business Models, and Innovation Opportunities. arXiv:2507.00172. https://arxiv.org/html/2507.00172v1

     **Annotation:** First comprehensive framework mapping traditional copyright doctrine to blockchain-based asset ownership. Key findings: 80% of mainstream NFTs fail to transfer copyright to purchasers, only 12-30% of marketplace listings include licensing information, 50-60% of secondary sales bypass creator royalties. Provides quantitative evidence for the thesis's argument that current NFT infrastructure is insufficient for proper rights management and that a purpose-built system (like the proposed CCRMS) is needed.

---

### Key Theme Shifts Since v1 (November 2025)

The following developments represent significant shifts in the landscape since the original literature review:

1. **ink! Discontinuation (January 2026)** — The ink! Rust smart contract language was officially discontinued following three unsuccessful OpenGov funding proposals. The implementation of ink! 6 in the thesis remains a valid proof-of-concept on pallet-revive/PolkaVM; however, deploying in a production environment would necessitate migration to Solidity or the community-maintained wrevive SDK. This matter should be addressed accordingly limitation.

2. **Polkadot 2.0 Fully Delivered (October 2025)** — Async Backing, Agile Coretime, and Elastic Scaling are all operational capabilities. The thesis should acknowledge these as established capabilities rather than future roadmap items. Achieving a 2-second block latency with 3 cores is currently feasible; a projected latency of 500ms with 12 cores is anticipated cores.

3. **Snowbridge V2 Production Launch (November 2025)** — The Ethereum-Polkadot bridge has transitioned from an experimental phase to a production environment, amassing a total value locked (TVL) of $75 million, accompanied by a 50% reduction in fees, and the capability for arbitrary contract calls. This development bolsters the thesis's discussion regarding the bridge, shifting it from a theoretical framework to an empirically supported demonstration validated.

4. **JAM Testnet (January 2026)** — The Join-Accumulate Machine advanced from the specification phase to the execution of a testnet, involving 43 implementation teams. The mainnet is projected for deployment by mid-2026. It signifies the anticipated successor to the relay chain architecture.

5. **Story Protocol Mainnet (February 2025)** — A blockchain dedicated to intellectual property, funded with $140 million, has been launched, thereby confirming the market demand for on-chain intellectual property management. It offers a comparison between Cosmos/EVM and the thesis's Polkadot/XCM approach.

6. **RISC-V Convergence** — Buterin's April 2025 proposal to replace the EVM with RISC-V substantiates the rationale behind Polkadot's PolkaVM architecture. Industry convergence enhances the technological validity of this thesis positioning.

7. **EU Regulatory Momentum** — The AI Act's copyright provisions (August 2025) and the European Parliament's AI copyright report (January 2026) establish new regulatory requirements for on-chain rights provenance systems. MiCA anticipates full enforcement (July 2026), with implications for token management classification.

8. **Market Acceleration** — Blockchain content monetization increased by 32% year-over-year to $659 million in 2025, with projections reaching $2.74 billion by 2030. The creator economy surpasses $280 billion. These data points substantially reinforce the economic rationale for the continued growth and development in this sector thesis.
