# Self-Publishing vs Traditional Publishing Rights — Thesis Notes

## Context

These notes capture insights from a discussion on 2026-03-22 about how the cross-chain content rights management system relates to traditional music publishing rights. The source article was "What Are Publishing Rights In Music? From Creation to Compensation" (musicisourweapon.org). The key insight is that the system is fundamentally a **self-publishing platform**, and this distinction strengthens the thesis argument.

---

## Traditional Publishing Rights Structure

In the traditional music industry, publishing rights are split into multiple streams:

| Right Type | What It Covers | Who Collects |
|-----------|---------------|-------------|
| **Mechanical royalties** | Per-reproduction payments (streams, downloads, physical copies) | The MLC (Mechanical Licensing Collective), publishers |
| **Performance royalties** | Public performance (radio, live venues, streaming, background music) | PROs (ASCAP, BMI, SESAC in the US) |
| **Synchronization licenses** | Use in film, TV, ads, games | Negotiated by publishers |
| **Print rights** | Sheet music reproduction | Publishers |

### Key Pain Points in the Traditional Model

1. **Multiple intermediaries**: Publishers, PROs, sub-publishers, collecting societies — each taking a percentage
2. **International complexity**: Different countries have different PROs, laws, and collection mechanisms. A single song played globally requires registration with multiple organisations
3. **Opaque royalty flows**: Creators often don't know exactly how much is owed or from which source
4. **Administrative burden**: Self-publishing artists must navigate rights management, royalty collection, and business networking themselves — without a publisher's infrastructure
5. **Delayed payments**: Royalties can take 6-18 months to flow through the collection chain
6. **Loss of control**: Working with a publisher means giving up some control over how a song is used
7. **Multi-rights-holder complexity**: Collaborative works (especially in classical, jazz) involve multiple rights holders, making distribution complicated

---

## How the Thesis System Differs: Self-Publishing Model

The cross-chain content rights management system operates as a **self-publishing platform** where the creator-to-consumer relationship is direct. This eliminates most of the traditional intermediary structure:

### The Creator IS the Publisher

In the traditional model, "publishing rights" exist because a publisher — a separate entity — manages the business side of a composition. In the thesis system:

- The **creator registers content directly** on-chain via `register_content`
- The **creator sets the access model** (subscription, PPV, or ownership) and the price
- The **creator receives payment directly** — no royalty splits, no publisher percentage
- The **blockchain is the registry** — no need for PRO registration or collecting society membership

### Mapping Traditional Rights to the System

| Traditional Right | Thesis System Equivalent | Key Difference |
|------------------|------------------------|----------------|
| Mechanical royalties (per-play) | `RightsType::PayPerView` | Direct payment to creator per access, no intermediary collection |
| Performance royalties (ongoing access) | `RightsType::Subscription` | Creator sets price and period, payment is immediate on-chain |
| Ownership/master rights | `RightsType::Ownership` | Permanent transfer via NFT, on-chain provenance, resale possible |
| International collection | XCM cross-chain operations | Borderless by design — cross-chain messages replace multi-country PRO registrations |
| Sync licensing | Not directly implemented | Could be future work: time-limited rights tokens with usage restrictions |

### What the System Disintermediates

| Traditional Intermediary | Role | Replaced By |
|------------------------|------|-------------|
| Publisher | Manages rights, negotiates deals, collects royalties | Creator manages directly via pallet extrinsics |
| PRO (ASCAP, BMI) | Tracks performances, collects/distributes performance royalties | `pallet-content-rights` tracks access and payments on-chain |
| Mechanical licensing body (MLC) | Collects mechanical royalties from streaming platforms | `pay_per_view` extrinsic handles per-access payments directly |
| Sub-publishers (international) | Collect royalties in foreign territories | XCM enables cross-chain access without territorial intermediaries |
| Collecting societies | Aggregate and distribute royalties across members | Smart contract logic distributes payments at transaction time |

---

## Thesis Writing Recommendations

### For Chapter 1 (Introduction) — 1-2 sentences
Position the system as addressing the inefficiencies of traditional content rights management, where multiple intermediaries fragment the creator-to-consumer relationship.

### For Chapter 2 (Background/Related Work) — 1-2 paragraphs
Briefly describe the traditional publishing rights structure (mechanical, performance, sync) and the intermediary chain (publishers, PROs, collecting societies). Cite the statistic that digital streaming accounts for ~80% of music industry revenue, and that US PROs alone distribute billions annually. Note that these systems evolved for a pre-digital, pre-blockchain world.

### For Chapter 4 (Methodology/Design) — 1 paragraph
Explain the design decision to use a unified `RightsType` enum (Subscription, PayPerView, Ownership) rather than modelling individual traditional right types. Justify this as appropriate for a self-publishing platform where the creator-publisher distinction collapses.

### For Chapter 5 (Implementation) — Brief mention
Note that the three access models intentionally map to the three primary revenue streams in content monetisation (ongoing access, per-consumption, permanent ownership) while eliminating the intermediary layer.

### For Chapter 8 (Discussion) — 1-2 paragraphs
**This is the strongest placement.** Contrast the traditional publishing rights model with the thesis system:
- Traditional: Creator → Publisher → PRO → Streaming Platform → PRO → Publisher → Creator (6+ hops, months of delay)
- Thesis system: Creator → Blockchain ← Consumer (direct, immediate settlement)

Argue that the self-publishing model enabled by on-chain rights management addresses the key pain points: opacity, delays, international complexity, and loss of control. Acknowledge the trade-off: self-publishing creators take on the administrative burden, but the system's automated access verification and payment handling reduces that burden significantly compared to traditional self-publishing.

### For Chapter 9 (Future Work) — 1 paragraph
Propose extensions for more complex rights scenarios:
- **Royalty splits**: Extend `register_content` to accept a `Vec<(AccountId, Percentage)>` for collaborative works, with automatic on-chain distribution at payment time
- **Sync licensing**: Time-bounded, usage-restricted rights tokens (e.g., "can use in video content for 12 months")
- **PRO oracle integration**: Bridge existing PRO data on-chain for hybrid models where traditional and blockchain-based rights coexist
- **Secondary market royalties**: Enforce creator royalties on ownership transfers (already partially supported via `transfer_ownership`)

---

## Key Statistic to Cite

> "Digital music streaming accounted for nearly 80% of all music industry revenues" — This supports the argument that content rights management must be digital-native, not an afterthought bolted onto physical-era infrastructure.

## References (for thesis bibliography)

Music Is Our Weapon (2024) 'What Are Publishing Rights In Music? From Creation to Compensation', *Music Is Our Weapon*. Available at: https://musicisourweapon.org/publishing-rights-in-music/ (Accessed: 22 March 2026).

### Additional References to Consider

These were not part of the original article but would strengthen the thesis sections discussed above:

- IFPI (2025) *Global Music Report 2025*. International Federation of the Phonographic Industry. — For the streaming revenue statistics and global market data.

- U.S. Copyright Office (2021) *Music Licensing Study*. Washington, DC. — For the regulatory framework around mechanical and performance licensing in the US.

- Rethink Music (2015) *Fair Music: Transparency and Payment Flows in the Music Industry*. Berklee Institute for Creative Entrepreneurship. — Landmark study on royalty flow opacity and intermediary inefficiencies. Frequently cited in blockchain-music literature.

- Sitonio, C. and Nucciarelli, A. (2018) 'The Impact of Blockchain on the Music Industry', *Proceedings of the 29th European Conference of the International Telecommunications Society (ITS)*. — Academic analysis of blockchain's potential to disintermediate music publishing.

- O'Dair, M. (2019) *Distributed Creativity: How Blockchain Technology Will Transform the Creative Economy*. Palgrave Macmillan. — Book-length treatment of blockchain in creative industries, including music rights management.

- WIPO (2023) *Understanding Copyright and Related Rights*. World Intellectual Property Organization. — For international rights framework context and terminology.
