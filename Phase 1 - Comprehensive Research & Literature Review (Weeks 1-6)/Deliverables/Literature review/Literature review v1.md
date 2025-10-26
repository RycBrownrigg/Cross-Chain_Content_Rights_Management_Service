### Summary of the Systematic Literature Review

This systematic literature review scrutinizes over 70 scholarly and industry publications (building upon the 16 referenced in the original thesis proposal) concerning cross-chain content rights management services, emphasizing decentralized frameworks for subscription, pay-per-view (PPV), and purchase modalities. The search encompassed principal academic databases and repositories (e.g., Google Scholar, ResearchGate, arXiv, IEEE, ACM) utilizing queries related to blockchain-based DRM, cross-chain interoperability, non-fungible tokens (NFTs) for content ownership, smart contracts for monetization, and decentralized content distribution. Publications were selected based on their relevance to the research question: effective strategies for designing cross-chain systems that guarantee scalability, interoperability, and economic sustainability efficiency.

Key themes emerged:

- **Blockchain for DRM and Copyright Protection**: Numerous scholarly articles (e.g., Xie et al., 2022; Zhang et al., 2024, as cited in the proposal) underscore the significance of blockchain technology in improving security, transparency, and traceability for digital content. Multi-blockchain frameworks mitigate vulnerabilities associated with single chains, while cross-chain protocols facilitate more effective dispute resolution and rights transfer. However, the majority of these studies concentrate on protection mechanisms rather than on monetization, thereby revealing a gap in practical applications such as subscription services and pay-per-view models.

- **Cross-Chain Interoperability**: Research related to Polkadot (e.g., Wood, 2016; Habermeier et al., 2021) and the extensive domain of cross-chain technology (e.g., surveys on XCM and consensus messaging) investigates scalable architectures for asset transfer and remote execution. These advancements align with the proposed application of Polkadot to facilitate seamless cross-network transactions; however, challenges such as latency and security issues in bridges (e.g., Ethereum-Polkadot) persist, necessitating a comprehensive investigation.

- **Decentralized Monetization Models**: The papers examine NFTs and tokenization for ownership and micro-payments (e.g., NFT reports from USPTO/USCO, 2024), automate subscriptions through smart contracts (e.g., DeFi models), and implement Pay-Per-View (PPV) in peer-to-peer networks. Decentralized platforms reduce intermediary fees—for example, from approximately 30% in centralized systems to less than 5% but challenges related to scalability under high load and compromises in user experience remain underexplored.

- **Smart Contracts and Applications**: Analyses (e.g., Lin et al., 2022; Ante, 2020) encompass ink! and Rust-based contracts for content distribution, incorporating IoT and security verification. They endorse the proposal's methodology but also identify gaps in domain-specific languages regarding content rights.

- **Challenges and Gaps**: Common issues encompass elevated transaction costs, regulatory challenges such as intellectual property laws concerning NFTs, and the delicate balance between decentralization and system performance. Industry publications, including those on Steem and CacheCash, illustrate tangible real-world prototypes; however, few address comprehensive cross-chain Pay-Per-View (PPV) or purchase integration. This review affirms the originality of the proposal in emphasizing monetization rather than solely protection, utilizing Polkadot for further development efficiency.

Overall, the literature endorses the feasibility of cross-chain systems; however, it emphasizes the necessity for further empirical evaluations of economic models. This broadens the proposal's bibliography, highlighting opportunities for the proposed framework to enhance interoperability and adopt a user-centric design approach.

### Annotated Bibliography

The following is an annotated bibliography comprising 78 selected papers, including the 16 from the original proposal for completeness and expansion. Each entry includes a citation and a concise annotation that summarizes key contributions, relevance to the thesis, and any identified limitations. The entries are organized thematically for clarity but are numbered sequentially.

#### Blockchain for DRM and Copyright Protection

1. **Alotaibi, S. J. (2023)**. Using smart contracts in the proposed blockchain framework for an identity management system based on the Internet of Things. *International Journal of Distributed Systems Technology, 14*(1), 1-22.  
   
   **Annotation:** This article underscores the necessity of this initiative by evaluating its feasibility in light of the limited available solutions. The proposed framework carefully considers two perspectives, examining eleven factors and emphasizing the essential features identified through research. 
   
2. **Ante, L. (2020)**. Smart contracts on the blockchain – A bibliometric analysis and review. *SSRN Electronic Journal*. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3576393  
   
   **Annotation:** This paper reviews peer-reviewed articles and references, summarizing current research. Using exploratory factor analysis, six research strands are identified: I) blockchain foundations and open questions, II) smart contracts in IoT, III) standardization, verification, and security, IV) disruption of industries, V) potentials and challenges, and VI) legal aspects. 

3. **Balcerzak, A. P., et al. (2022)**. Blockchain technology and smart contracts in decentralized governance systems. *Administrative Sciences, 12*(3), 96. https://doi.org/10.3390/admsci12030096  
   
   **Annotation:** This article examines the application of blockchain technology for governance purposes, specifically in facilitating transparent revenue sharing associated with content rights. It adheres to the principles of decentralization in assessment; however, it is confined to non-technical context studies.

4. **Chen, F., et al. (2020)**. Blockchain for Internet of Things applications: A review and open issues. *Journal of Network and Computer Applications, 173*, 102854. https://doi.org/10.1016/j.jnca.2020.102854  
   
   **Annotation:** This paper reviews recent advances in employing blockchain technology to develop more reliable Internet of Things (IoT) systems. It categorizes the research into four distinct roles of blockchain within IoT: access control platform, data security platform, trusted third party, and automatic payment platform, while discussing the future challenges associated with each role.

5. **Divyashree, K. S., & Mishra, A. (2023)**. Blockchain technology in financial sector and its legal implications. *Lecture Notes in Networks and Systems, 478*, 219-231.  
   
   **Annotation:** This paper aims to explore how blockchain technology is utilized within the financial sector and to analyze the associated legal implications. It will define the concept of blockchain technology, examine its applications in the financial industry, discuss the necessity for regulation, and ultimately, present conclusions along with proposed corrective measures.

6. **Habermeier, R., et al. (2021)**. Polkadot’s messaging scheme. *Web3 Foundation Research*. https://medium.com/web3foundation/polkadots-messaging-scheme-b1ec560908b7  
   
   **Annotation:** Details XCM for cross-chain communication. It is fundamental to the methodology of the proposal and demonstrates efficiency trade-offs.

7. **Kumar, R. K., et al. (2023)**. Revolutionizing digital ownership: Examining the perks of a Polkadot-based NFT marketplace. *ResearchGate*. https://doi.org/10.13140/RG.2.2.26304.87040  
   
   **Annotation:** As Polkadot's ecosystem expands, this research investigates its impact on the broader NFT market, providing valuable insights into the future of digital ownership. This study aids the ongoing discourse regarding the transformation of the digital realm through decentralized and efficient ownership mechanisms by assessing the benefits of Polkadot-based NFT marketplaces.

8. **Lin, S. Y., et al. (2022)**. A survey of application research based on blockchain smart contract. *Wireless Networks, 28*, 635-690. https://doi.org/10.1007/s11276-021-02874-2  
   
   **Annotation:** This paper examines the development and challenges associated with blockchain smart contracts. It addresses the technical difficulties encountered by smart contracts, analyzes their influence on large-scale applications and the sustainability of mining systems, and explores future research directions in the field of blockchain smart contracts.

9. **Parity Technologies. (2022)**. ink! 3.0: Parity’s Rust-based language for WASM smart contracts gets a major update. https://www.parity.io/blog/ink-3-0-paritys-rust-based-language-gets-a-major-update  
   
   **Annotation:** Updates concerning ink! for WebAssembly contracts are essential for implementation and focus on performance enhancements.

10. **Parity Technologies. (2022)**. What is Parity’s ink!? https://www.parity.io/blog/what-is-paritys-ink  
    
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

#### Cross-Chain Interoperability and Polkadot

21. **Abbas, H., et al. (2022)**. Analysis of Polkadot: Architecture, Internals, and Contradictions. https://www.cri-lab.net/wp-content/uploads/2022/07/IEEE_Blockchain_2022__Polkadot_Architecture___Limitations.pdf  
    
    **Annotation:** This paper provides the first systematic examination of the Polkadot environment, offering a comprehensive analysis of its protocols, governance structure, and economic model. It identifies several limitations—supported by empirical analysis of its ledger—that could substantially affect the network’s scalability and overall security.

22. **TokenInsight Research. (2021)**. 2021 Polkadot Ecosystem Research Report. https://downloads.coindesk.com/research/2021-Polkadot-Ecosystem-Research-Report.pdf  
    
    **Annotation:** Projects within the Polkadot ecosystem primarily encompass decentralized finance (DeFi) initiatives aimed at fostering ecosystem expansion, liquidity staking, and development tools. Additionally, it endorses infrastructure projects pertaining to data management, privacy, and cross-chain solutions. This report outlines principal projects categorized by sector.

23. **Moreno, M.F., et al. (2023)**. A Knowledge-Oriented Approach to Enhance Integration... https://arxiv.org/pdf/2308.00735  
    
    **Annotation:** The Polkadot ecosystem has a complex multi-chain architecture that challenges data analysis and communication. This document presents a framework using a domain ontology called POnto (Polkadot Ontology) to address these issues. It also describes a case study approach to validate the framework, incorporating expert feedback and insights from the Polkadot community.

24. **Zhou1, Q., et al. (2021)**. A Study on Blockchain Interoperability Mechanism. https://www.aasmr.org/jsms/Vol11/vol.11.4.7.pdf  
    
    **Annotation:** This paper presents a cross-chain framework based on modularity, abstraction, and layering, separating cross-chain functions from consensus and app logic. It uses Merkle proofs to verify cross-chain activities. Homogeneous and heterogeneous blockchains are addressed separately due to their differences. 

25. **Valaštín V., et al. (2024)**. Protocol for Unifying Cross-Chain Liquidity on Polkadot. https://pdfs.semanticscholar.org/5152/064e23fb989674640caaa438495dbb83a88c.pdf  
    
    Annotation: This paper introduces LiquiSpell, a protocol designed to unify liquidity across Polkadot parachains. Using cross-chain message passing (XCMP), it creates a universal transaction that is compatible with any parachain, regardless of its architecture or asset management. This addresses the heterogeneity of parachains, enabling seamless asset sharing and better cross-chain interoperability.

26. **Mao, H., et al. (2022)**. A Survey on Cross-Chain Technology: Challenges, Development, and Prospect https://www.researchgate.net/publication/366226788_A_Survey_on_Cross-Chain_Technology_Challenges_Development_and_Prospect/fulltext/6398c305095a6a777428e29c/A-Survey-on-Cross-Chain-Technology-Challenges-Development-and-Prospect.pdf  
    
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
    
    **Annotation:** This thesis offers a theoretical framework to understand blockchain's impact, often missing in legal copyright literature. Chapter 1 examines the history of copyright and rights management to assess whether blockchain challenges legal principles. Chapter 2 discusses the nature and potential of blockchain in copyright and rights management. Chapter 3 introduces Luhmann’s systems theory to analyze the effect of blockchain, leading to the final chapter that summarizes key findings.

32. **Yin, Z., et al. (2022)**. Bool Network: An Open, Distributed, Secure Cross-chain Notary Platform. https://eprint.iacr.org/2022/1290.pdf  
    
    **Annotation:** This paper examines notary-based cross-chain solutions that provide the highest levels of compatibility and user-friendliness; however, these solutions are generally characterized by centralization. To mitigate this issue, the Bool Network has been introduced as an open, distributed, and secure cross-chain notary platform powered by Multi-Party Computation (MPC)-based distributed key management over dynamic hidden committees. 

33. **Orero, P. et al. (2023)**. The Visible Subtitler: Blockchain Technology for Right Management and Minting. https://open-research-europe.ec.europa.eu/articles/3-26/pdf  
    
    **Annotation:** The paper offers a comprehensive overview of subtitle copyright issues, followed by a detailed analysis of both centralized and decentralized copyright management systems. It also explores the potential application of blockchain technology to facilitate the identification of subtitlers. Moreover, a focus group comprising expert professional subtitlers was convened, and their feedback has been thoroughly documented.

34. **Munson, M., et al. (2022)**. Blockchain Content Fabric for Multi-Chain Content Ownership and Distribution. https://eluv.io/3e39198441b1d578bc0f.pdf  
    
    **Annotation:** This paper aims to outline the core design principles of the Content Fabric Protocol (CFP) from both content and blockchain perspectives and introduce an innovative on-chain and cross-chain system for verifying ownership and authorization in decentralized content sharing through digital tokens. 

35. **Chen, K., et al. (2023)**. A Trusted Reputation Management Scheme for Cross-Chain Transactions. https://orbit.dtu.dk/files/330353284/sensors_23_06033.pdf  
    
    **Annotation:** This study offers a reputation management mechanism based on nodes’ transaction history. It assesses reputation for quick detection of malicious activity. To enhance accuracy and flexibility, Particle Swarm Optimization (PSO) is integrated, supporting various blockchain platforms. The paper emphasizes the importance of securing cross-chain transactions and presents a method to prevent misconduct through reputation monitoring.

36. **Tao, R. (2025)**. The Study of Blockchain Technology for Copyright Protection and Resource Sharing Models in Library Digital Resources. http://www.issplc.com/api/detail/journalDetail/id/3968  
    
    **Annotation:** This paper examines blockchain's potential in libraries for protecting digital copyrights and resource sharing. Its decentralized ledger can create secure, transparent, and automated systems for digital rights management, ensuring fair pay for authors. The paper also addresses challenges such as scalability, privacy, and legal issues. It suggests that tech advances will enhance security, efficiency, and transparency in digital resource management in libraries.

37. **Buzu, I. (2021)**. Blockchain, smart contracts and copyright management disruption. https://papers.ssrn.com/sol3/Delivery.cfm/SSRN_ID3759260_code3591422.pdf  
    
    **Annotation:** This paper examines the relationship between blockchain technology and copyright law, utilizing international copyright law as the analytical framework.

#### Decentralized Monetization Models (Subscription, PPV, Purchase)

38. **Zheng, H., et al. (2024)**. Decentagram: Highly-Available Decentralized Publish/Subscribe Systems. https://owenarden.github.io/home/papers/decentagram.pdf  
    
    **Annotation:** This paper presents Decentagram, a decentralized framework designed for data dissemination that adopts the publish/subscribe messaging paradigm. Decentagram utilizes blockchain smart contracts to verify events published via digital signatures or self-attestation certificates generated within trusted execution environments (TEEs), both of which are validated on-chain.

39. **Osemwegie, O. (2025)**. Decentralized Media Distribution: Exploring blockchain’s role in copyright protection, monetization, and content ownership rights. https://www.mechanicaljournals.com/ijmtme/article/52/6-1-1-964.pdf  
    
    **Annotation:** This paper examines blockchain's role in decentralized media, showing how cryptographic hashing and timestamping ensure copyright, authenticity, and ownership. It explores monetization methods like micropayments and tokenization that enable creators' peer-to-peer transactions without intermediaries. The study also discusses challenges like scalability, regulations, and adoption barriers in blockchain media systems.

40. **Virovets, D., et al. (2025)**. A Framework for Decentralized Payment Instrument Integration with Artificial Intelligence, Big Data, and Digital Identities. https://ceur-ws.org/Vol-3991/paper33.pdf  
    
    **Annotation:** This study aims to analyze the technological challenges and opportunities associated with integrating decentralized payment instruments with other information and communication technologies. Furthermore, it intends to propose strategies for effectively leveraging modern decentralized payment instruments.

41. **Zeggari, M., et al. (2022)**. An Efficient and Decentralized Blockchain-based Commercial Alternative. https://eprint.iacr.org/2022/1440.pdf  
    
    **Annotation:** This document introduces Lyzis Labs, an incentive-driven, decentralized protocol for a blockchain-based online marketplace. The Lyzis Marketplace connects parties securely without a Trusted Third Party (TTP), ensuring transparent, protected data storage.

42. **Baliga, A.. (2020)**. Understanding Blockchain Consensus Models. https://www.persistent.com/wp-content/uploads/2017/04/WP-Understanding-Blockchain-Consensus-Models.pdf  
    
    **Annotation:** This white paper provides an overview of consensus models adopted by popular blockchain platforms and analyzes their merits and demerits.

43. **Li, L., et al. (2024)**. Why Blockchain-Based Digital Assets Are Owned on Decentralized Metaverse Platforms?  https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/da7d3ba9-379e-48a8-98e8-18b2bc293b1f/content  
    
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
    
    **Annotation: **This paper presents a blockchain-based framework using smart contracts to streamline royalty distributions, ensuring transparency, efficiency, and fairness for content creators. It examines the smart contract architecture, evaluates its financial aspects, and highlights its potential to transform content monetization. The paper also explores the mathematical models behind royalty calculations and the interdisciplinary integration of computer science, mathematics, and economics. 

54. **Wamugo, M.. (2024)**. Content monetization: non-fungible tokens as a new revenue stream for the media sector in Kenya. stream for the media sector in Kenya. https://ecommons.aku.edu/cgi/viewcontent.cgi?article=3232&context=theses_dissertations  
    
    **Annotation:** This study explores NFTs as an alternative revenue source for Kenyan media outlets, using mixed methods. It aims to identify opportunities, challenges, and the potential role of this stream in supporting media with authentic content. 

55. **Moncada, R., et al. (2021)**. DLT-enabled Platforms: Distribution and Management of Media Content. https://mediaverse-project.eu/wp-content/uploads/2021/09/Research-Note-Blockchain-based-Platforms_integrated.pdf  
    
    **Annotation:** This isanalysis DLT-enabled platforms for the distribution and management of media content. 

#### NFTs and IP Rights

56. **USPTO. (2024)**. Non-Fungible Tokens and Intellectual Property: A report to Congress. https://www.copyright.gov/policy/nft-study/Joint-USPTO-USCO-Report-on-NFTs-and-Intellectual-Property.pdf  
    
    **Annotation:** This paper examines the legal and policy implications of intellectual property rights in relation to NFTs, which are part of a burgeoning tech field utilizing blockchain across various applications. Many applications, such as proving ownership of digital art or authenticating products and services, inherently involve IP rights.

57. **Davik, C. (2025)**. The Art Of NFTs: Copyright, Contracts, And The Fallacy Of Ownership. https://georgialawreview.org/wp-content/uploads/2025/01/Davik_The-Art-of-NFTs.pdf  
    
    **Annotation:** This article advocates for greater transparency in the NFT marketplace, enabling consumers to understand their rights regarding the artwork clearly. Transparency helps prevent dissatisfaction and legal issues, such as copyright infringement. Buyers need to know if reproducing, distributing, or exploiting the work is allowed to assess the true cost of an NFT.

58. **Salman, B., et al. (2023)**. NFT-Based Secure Platform for Copyright Images[NFT-SPCI]. https://tijer.org/tijer/papers/TIJER2307069.pdf  
    
    **Annotation:** This paper proposes a blockchain-based platform utilizing NFTs, whereby digital artists can generate an NFT for their artwork to establish ownership, authenticity, and copyright rights without difficulty, as well as commercialize their art using cryptocurrencies.

59. **Eurojust. (2024)**. Non-Fungible Tokens and Intellectual Property Rights - Can the use of NTFs lead to IP infringements?. https://www.eurojust.europa.eu/sites/default/files/assets/eurojust-nfts-intellectual-property-rights-flyer.pdf  
    
    **Annotation:** This flyer highlights the increasing adoption of non-fungible tokens (NFTs) within the art industry and provides an analysis of the implications for copyright and trademark rights. Additionally, it offers an overview of recent judicial decisions that impact this evolving domain, which presently lacks a comprehensive legal regulatory framework.

60. **Darshan, P., et al. (2025)**. Intellectual Property Rights and Entrepreneurship in the NFT Ecosystem Legal Frameworks, Business Models, and Innovation Opportunities. https://www.arxiv.org/pdf/2507.00172  
    
    **Annotation:** This paper examines the gap between traditional copyright law and blockchain transactions. Using a mixed-methods approach, it develops an intellectual property rights matrix to show the link between copyright law and NFT ownership. The research suggests solutions like standardized licensing, rights management, and compliance guidelines.

61. **Murray, M.. (2022)**. NFT Ownership And Copyrights. https://mckinneylaw.iu.edu/practice/law-reviews/ilr/pdf/vol56p367.pdf  
    
    **Annotation:** This paper aims to educate diverse audiences and provide clarity on copyright issues within the realm of NFTs and blockchain technology.

62. **Dreyer, A., et al. (2021)**. Can I mint an NFT with that?: Avoiding right of publicity and trademark litigation risks in the brave new world of NFTs. https://www.skadden.com/-/media/files/publications/2021/05/canimintannftwiththatavoidingrightofpublicityandtr.pdf  
    
    **Annotation:** This article examines how NFTs could implicate rights across various categories of IP. It discusses the extent to which existing commercial license agreements granting rights in those categories may — or may not — permit the creation and sale of NFTs.

63. **Gatto, J., et al. (2021)**. NFT License Breakdown: Exploring Different  Marketplaces and Associated License Issues. https://www.lawoftheledger.com/wp-content/uploads/sites/15/2021/09/NFT-License-Breakdown-Article-0921.pdf  
    
    **Annotation:** This article will explain some distinctions among these types of marketplaces, highlight various licensing terms associated with them, and discuss why intellectual property (IP) owners who license their IP for non-fungible tokens (NFTs) are often best advised to develop their own licensing agreements to facilitate the sale of their NFTs.

64. **Reggianini, E. (2025)**. Standardizing On-chain IP Rights Management. https://blockstand.eu/blockstand/uploads/2025/05/Standardizing-On-chain-IP-Rights-Management_Reggianini.pdf  
    
    **Annotation:** This paper reviews a framework for standardized NFT licensing processes, licensee rights, and royalty distribution under European standards. Unlike Web2, where copyright enforcement and royalties can be burdensome and opaque, our Web3 approach utilizes blockchain and smart contracts for transparency, efficiency, and a creator-focused system.

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
    
    Annotation: This paper explains the concept of "smart contracts” and delineates how they differ from existing commercial tools. It also examines whether smart contracting, on balance, provides a superior method for facilitating valuable commitments.  

72. **Kulkarani, S., et al. (2024)**. Blockchain Enabled Smart Contracts for Digital Assets. https://ijarsct.co.in/Paper15404.pdf  
    
    **Annotation:** This overview explores the uses and benefits of blockchain and smart contracts across sectors such as DeFi, supply chains, asset tokenization, NFTs, and identity verification. Smart contracts are valued for cost savings and security, with blockchain's cryptography improving system integrity. 

73. **Mauro, N. (2022)**. Smart contracts for decentralized business models in the electricity market: a consumer protection perspective. https://emle.org/wp-content/uploads/2023/01/EMLE_thesis_Mauro_Noemi.pdf  
    
    **Annotation:** This research explores smart contracting in P2P electricity trading, with a focus on consumers. It evaluates smart contracts and blockchain from legal and economic views, especially their potential to lower negotiation costs. A brief overview of the electricity market's features and challenges is included. The study concludes by discussing the implications of smart contracts for consumers. 

74. **Zheng, Z., et al. (2019)**. An Overview on Smart Contracts: Challenges, Advances and Platforms. https://arxiv.org/pdf/1912.10370  
    
    **Annotation:** This report offers a comprehensive overview of smart contracts, starting with blockchain technology and the concept of smart contracts. It discusses challenges, recent advancements, compares major platforms, and categorizes applications with examples.

#### Decentralized Content Distribution Networks

75. **Goyal, P., et al. (2019)**. Secure Incentivization for Decentralized Content Delivery. https://www.usenix.org/system/files/hotedge19-paper-goyal_0.pdf  
    
    **Annotation: **This paper examines the effectiveness of monetary incentives in P2P content delivery systems. It introduces Gringotts, a secure transaction system with an innovative Proof of Delivery to confirm file delivery. Gringotts uses cryptocurrency for payments, safeguarding against dishonesty and Sybil attacks. 

