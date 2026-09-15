# Sourcing and Encoding Government Scheme Data for Rule-Based Eligibility Matching: The Saathi Vyapar Scheme Catalogue

**Team Pantheon Eternal** — Smart India Hackathon, Problem Statement SIH26091 (Ministry of Social Justice & Empowerment)

*Project: Saathi Vyapar (साथी व्यापार) — AI-Powered Financial Advisory & Government Scheme Matching Platform for Rural Micro-Entrepreneurs in India*

---

## Abstract

Rural micro-entrepreneurs in India have access to more than a hundred central and state-level livelihood, credit and skilling schemes, yet awareness and claim rates remain very low. Saathi Vyapar addresses this gap with an explainable, rule-based scheme-matching engine that evaluates an entrepreneur's business profile against a curated catalogue of government schemes and returns a per-scheme eligibility verdict with human-readable reasons. This paper documents the provenance of that catalogue: the fifteen schemes selected for the pilot, the official government sources from which each scheme's description, benefit summary, eligibility criteria and application link were obtained, the methodology used to translate prose eligibility conditions into machine-readable JSONB rules, and the known limitations of this encoding. Every scheme in the catalogue is traceable to a portal operated by the Government of India, a central ministry, or a statutory public-sector corporation, so that end users can verify any recommendation at the authoritative source.

**Keywords:** government schemes, eligibility matching, rule engine, financial inclusion, micro-enterprises, MSME, PMEGP, PMMY, Stand-Up India, PM SVANidhi, open government data

---

## 1. Introduction

India has an estimated 6.3 crore unincorporated non-agricultural enterprises, the overwhelming majority of which are own-account micro-enterprises operating in the informal sector [1]. The Government of India and its ministries operate a large portfolio of schemes targeted at this population — credit-linked subsidies (PMEGP), collateral-free micro-loans (PMMY), greenfield enterprise loans for SC/ST and women entrepreneurs (Stand-Up India), working-capital loans for street vendors (PM SVANidhi), concessional finance through national finance and development corporations (NSFDC, NSTFDC), and skilling programmes (PMKVY, DAY-NRLM). Despite this breadth, scheme discovery remains a significant barrier: eligibility conditions are published as prose across many portals, in different formats, and rarely in the entrepreneur's own language.

Saathi Vyapar's *Yojana Kendra* module matches a structured business profile (revenue, expenses, social category, sector, gender, state) against a scheme catalogue and produces an explainable verdict for each scheme. The reliability of this module depends entirely on the accuracy and provenance of the underlying scheme data. This paper therefore answers a single question in full: **where did the scheme data come from, and how was it encoded?**

## 2. Related Work and Existing Data Sources

Two categories of prior art informed the data-sourcing approach.

**Government aggregator portals.** The *myScheme* National Platform [2], operated by the Ministry of Electronics and Information Technology (MeitY) through the National e-Governance Division, aggregates scheme information across ministries and provides a questionnaire-driven eligibility check. It served as a cross-referencing index to confirm scheme names, administering ministries and continuing validity, but it was not used as the primary source for any eligibility figure because it summarises rather than reproduces the underlying guidelines.

**Scheme-specific official portals.** Each scheme in the catalogue has a primary portal operated by its implementing agency (e.g., KVIC for PMEGP, MUDRA Ltd. for PMMY, SIDBI for Stand-Up India, MoHUA for PM SVANidhi). These portals publish the operative guidelines, eligibility conditions, loan bands, subsidy percentages and application processes, and were treated as the **authoritative primary sources** for every field stored in the catalogue.

## 3. Methodology

### 3.1 Scheme selection criteria

Schemes were included in the pilot catalogue if they satisfied all of the following:

1. **Central government or statutory body scheme** — administered by a Union ministry, a public-sector corporation, or a body constituted under an Act of Parliament, so that the scheme is available nationally rather than in a single state.
2. **Relevance to micro-entrepreneurs** — the scheme provides credit, subsidy, guarantee, skilling or livelihood support that a rural sole proprietor or SHG member can directly avail.
3. **Alignment with the problem statement** — SIH26091 is sponsored by the Ministry of Social Justice & Empowerment; the catalogue therefore deliberately over-represents schemes for Scheduled Castes, Scheduled Tribes and women (PM-AJAY, NSFDC, NSTFDC, Mahila Samridhi Yojana, Udyam Sakhi, DAY-NRLM, Stand-Up India).
4. **Encodable eligibility** — the scheme's principal eligibility conditions can be expressed in terms of the six profile attributes the platform collects (annual turnover, social category, sector, gender, state, loan size).
5. **Live application channel** — an official portal exists at which the entrepreneur can apply or obtain the application process.

### 3.2 Data collection procedure

For each scheme, the following fields were extracted from its official portal and, where available, the published scheme guidelines:

| Field in `schemes` table | What was extracted | Source type |
|---|---|---|
| `name` | Official scheme name and acronym | Portal masthead / guidelines title |
| `description` | Objective and implementing agency | "About the scheme" section of guidelines |
| `benefit_summary` | Loan range, subsidy %, interest rate, non-financial benefits | Guidelines — "Quantum of assistance" / "Financial parameters" |
| `eligibility_rules` (JSONB) | Category, gender, sector, turnover/income ceiling, loan band | Guidelines — "Eligibility" section, converted per §3.3 |
| `application_link` | Official application/information URL | Portal home page |

All links were verified to resolve to a `gov.in`, `nic.in` or officially-operated domain at the time of seeding (see Appendix A for the full list).

### 3.3 Encoding prose eligibility into JSONB rules

The matching engine (`src/lib/engines/schemeMatcher.ts`) evaluates six rule keys. The mapping from published prose to rule keys was as follows:

| Rule key | Meaning | Encoding rule |
|---|---|---|
| `category` | Eligible social categories (`sc`, `st`, `obc`, `general`, `minority`) | Included only where the guidelines *restrict* eligibility to specific categories (e.g., NSFDC = `["sc"]`). Omitted for open schemes. |
| `gender` | `female` / `male` / `any` | Set to `female` only where the scheme is exclusively for women (Mahila Samridhi Yojana, Udyam Sakhi, DAY-NRLM women SHGs). |
| `sector` | Eligible business sectors | Derived from the guidelines' list of permitted activities, normalised to the platform's sector vocabulary. |
| `state` | State restriction | Not set for any scheme in the pilot — all fifteen are national. |
| `loan_amount_min` / `loan_amount_max` | Loan band in ₹ | Taken verbatim from the guidelines where a band is published (PMMY Shishu/Kishor/Tarun, Stand-Up India, PM SVANidhi, CGTMSE, NSFDC, NSTFDC). |
| `income_max` | Maximum annual turnover/income in ₹ | Taken verbatim where the scheme publishes an income ceiling (NSFDC, NSTFDC and MSY use the "double the poverty line" family-income ceiling; DAY-NRLM targets BPL households). **Where a scheme publishes no turnover ceiling, a proxy ceiling was set by the team** to keep the recommendation relevant to micro-enterprises (see §5, Limitation 1). |

A scheme with an empty rule object is treated by the engine as universally applicable. Every rule failure produces a ✗ reason string and every rule pass produces a ✓ reason string, so the entrepreneur (or facilitator) can see exactly which published condition was or was not met.

## 4. The Scheme Catalogue and Its Sources

The fifteen schemes seeded in `supabase/seed/schemes.sql`, grouped by administering body, with the source consulted for each.

### 4.1 Ministry of Micro, Small & Medium Enterprises (MSME)

| # | Scheme | Implementing agency | Key encoded parameters | Source |
|---|---|---|---|---|
| 1 | **PMEGP** — Prime Minister's Employment Generation Programme | Khadi & Village Industries Commission (KVIC) | Subsidy 15–35% of project cost; project cost up to ₹25 lakh (manufacturing) / ₹10 lakh (service); sectors: manufacturing, services, retail, food processing, handicrafts, textile | [3] |
| 11 | **Udyam Sakhi** — Women Entrepreneurship Portal | Ministry of MSME | Women only; training, mentorship and credit facilitation | [4] |
| 14 | **CGTMSE** — Credit Guarantee Fund Trust for Micro & Small Enterprises | CGTMSE (set up by Ministry of MSME and SIDBI) | Guarantee cover 75–85% on collateral-free loans up to ₹5 crore; loan band ₹10,000 – ₹5 crore | [5] |
| 15 | **KVIC Honey Mission** | KVIC | Beekeeping / agriculture / rural livelihood; training, bee colonies, equipment | [6] |

### 4.2 Department of Financial Services, Ministry of Finance

| # | Scheme | Implementing agency | Key encoded parameters | Source |
|---|---|---|---|---|
| 2 | **PMMY — Shishu** | MUDRA Ltd. (SIDBI subsidiary) via banks/NBFCs/MFIs | Loan up to ₹50,000, collateral-free | [7] |
| 3 | **PMMY — Kishor** | MUDRA Ltd. | Loan ₹50,001 – ₹5 lakh | [7] |
| 4 | **PMMY — Tarun** | MUDRA Ltd. | Loan ₹5 lakh – ₹10 lakh | [7] |
| 5 | **Stand-Up India** | SIDBI (Stand-Up Mitra portal) | Loan ₹10 lakh – ₹1 crore; SC/ST and women; greenfield enterprises in manufacturing, services, trading | [8] |

### 4.3 Ministry of Housing & Urban Affairs

| # | Scheme | Key encoded parameters | Source |
|---|---|---|---|
| 6 | **PM SVANidhi** — PM Street Vendor's AtmaNirbhar Nidhi | Working-capital loans ₹10,000, rising to ₹20,000 and then ₹50,000 on timely repayment; street vending / retail / food services | [9] |

### 4.4 Ministry of Social Justice & Empowerment

| # | Scheme | Implementing agency | Key encoded parameters | Source |
|---|---|---|---|---|
| 7 | **PM-AJAY** — Pradhan Mantri Anusuchit Jaati Abhyuday Yojana | Department of Social Justice & Empowerment | SC only; skill training, livelihood and income-generation support | [10], [11] |
| 8 | **NSFDC** term loans | National Scheduled Castes Finance & Development Corporation | SC only; family income up to double the poverty line (encoded ₹3 lakh); loan ₹10,000 – ₹15 lakh at concessional interest | [12] |
| 10 | **Mahila Samridhi Yojana** | NSFDC (through SCAs / SHGs) | SC women only; micro-credit up to ₹1.4 lakh at 4% p.a.; income ceiling as per NSFDC | [12], [10] |

### 4.5 Ministry of Tribal Affairs

| # | Scheme | Implementing agency | Key encoded parameters | Source |
|---|---|---|---|---|
| 9 | **NSTFDC** concessional loans | National Scheduled Tribes Finance & Development Corporation | ST only; family income up to double the poverty line (encoded ₹4 lakh); loan ₹10,000 – ₹20 lakh at 6–8% p.a.; agriculture, forestry, handicrafts, manufacturing, services | [13] |

### 4.6 Ministry of Skill Development & Entrepreneurship

| # | Scheme | Key encoded parameters | Source |
|---|---|---|---|
| 12 | **PMKVY** — Pradhan Mantri Kaushal Vikas Yojana | Free short-term training and RPL certification; 300+ job roles; placement assistance | [14] |

### 4.7 Ministry of Rural Development

| # | Scheme | Key encoded parameters | Source |
|---|---|---|---|
| 13 | **DAY-NRLM** — Deendayal Antyodaya Yojana – National Rural Livelihoods Mission | Women SHG members from poor rural households; interest subvention (credit at 7% p.a.), revolving fund, community investment fund; agriculture, handicrafts, food processing, retail, services | [15] |

## 5. Validation and Limitations

The team applied three checks before seeding: (i) every `application_link` was opened and confirmed to be the official portal; (ii) every loan band and subsidy percentage was checked against the figure published on that portal; (iii) the matcher was unit-tested (`schemeMatcher.test.ts`) against synthetic profiles to confirm that each rule key produces the expected ✓/✗ reason.

The following limitations are acknowledged and were discussed in the project's viva guide:

1. **Proxy turnover ceilings.** PMEGP, PMMY, Stand-Up India, Udyam Sakhi, PMKVY, CGTMSE and the KVIC Honey Mission do not publish an annual-turnover ceiling for applicants. For these, the `income_max` value in the seed is a *team-assigned proxy* (e.g., ₹1 crore for PMEGP, ₹25 lakh for PMMY Shishu) chosen so that the platform does not recommend micro-loan schemes to businesses far outside their intended scale. These values are not statutory limits and are clearly flagged as such in this paper. The actual PMMY, CGTMSE and Udyam registration thresholds are defined by the MSME classification (investment and turnover) notified under the MSMED Act [16], not by applicant income.
2. **Poverty-line ceilings are simplified.** NSFDC, NSTFDC and MSY define eligibility as family income up to double the poverty line (DPL), which varies by rural/urban location and is periodically revised. The seed encodes a single rupee figure per scheme; the live guideline should be consulted for the current DPL.
3. **Scheme parameters change.** Subsidy rates, loan bands and interest subventions are revised by the administering ministries. The catalogue is a point-in-time snapshot; the `updated_at` trigger on the `schemes` table exists so that facilitators can re-seed when guidelines change.
4. **No state schemes yet.** The `state` rule key is implemented but unused; state-level schemes (e.g., state SC/ST corporations, state MSME policies) are planned for a later phase.
5. **Advisory, not authoritative.** The platform presents a match as a *likely* eligibility with reasons and a link to the official portal; the final decision rests with the implementing agency. This is a deliberate design choice — the system is advisory, not an authority.

## 6. Conclusion

All fifteen schemes in the Saathi Vyapar catalogue were sourced from official portals of the Government of India, its ministries, or statutory public-sector corporations, and every record carries a verifiable link back to that source. Prose eligibility conditions were converted into six machine-readable rule keys using a documented, conservative encoding, with proxies clearly identified where a scheme publishes no turnover ceiling. This provenance discipline is what allows the matcher to be *explainable*: each ✓ or ✗ it emits corresponds to a condition the entrepreneur can read for themselves on the government's own website.

---

## References

[1] National Sample Survey Office, Ministry of Statistics and Programme Implementation. *Key Indicators of Unincorporated Non-Agricultural Enterprises (Excluding Construction) in India, NSS 73rd Round (July 2015 – June 2016)*. Government of India, 2017. https://www.mospi.gov.in/

[2] Ministry of Electronics and Information Technology, National e-Governance Division. *myScheme — National Platform for Government Schemes*. https://www.myscheme.gov.in/ (accessed 2026).

[3] Khadi and Village Industries Commission, Ministry of MSME. *Prime Minister's Employment Generation Programme (PMEGP) — e-Portal and Scheme Guidelines*. https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp (accessed 2026).

[4] Ministry of Micro, Small & Medium Enterprises. *Udyam Sakhi — Portal for Women Entrepreneurs*. https://udyamsakhi.org/ (accessed 2026).

[5] Credit Guarantee Fund Trust for Micro and Small Enterprises. *Credit Guarantee Scheme — Scheme Guidelines and Guarantee Coverage*. https://www.cgtmse.in/ (accessed 2026).

[6] Khadi and Village Industries Commission. *Honey Mission / Bee-Keeping Programme*. https://kvic.gov.in/kvicres/bee-keeping.php (accessed 2026).

[7] Micro Units Development & Refinance Agency Ltd. (MUDRA), Department of Financial Services, Ministry of Finance. *Pradhan Mantri MUDRA Yojana (PMMY) — Shishu, Kishor and Tarun Loan Categories*. https://www.mudra.org.in/ (accessed 2026).

[8] Small Industries Development Bank of India (SIDBI), Department of Financial Services. *Stand-Up India Scheme — Stand-Up Mitra Portal*. https://www.standupmitra.in/ (accessed 2026).

[9] Ministry of Housing and Urban Affairs. *PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi) — Scheme Guidelines*. https://pmsvanidhi.mohua.gov.in/ (accessed 2026).

[10] Ministry of Social Justice and Empowerment. *Schemes and Programmes — Department of Social Justice & Empowerment*. https://socialjustice.gov.in/ (accessed 2026).

[11] Ministry of Social Justice and Empowerment. *Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY) — Scheme Portal*. https://pmajay.dosje.gov.in/ (accessed 2026).

[12] National Scheduled Castes Finance and Development Corporation (NSFDC), Ministry of Social Justice and Empowerment. *Loan Schemes — Term Loan, Micro Credit Finance and Mahila Samridhi Yojana*. https://nsfdc.nic.in/ (accessed 2026).

[13] National Scheduled Tribes Finance and Development Corporation (NSTFDC), Ministry of Tribal Affairs. *Schemes — Term Loan, Adivasi Mahila Sashaktikaran Yojana and Micro Credit*. https://www.nstfdc.nic.in/ (accessed 2026).

[14] Ministry of Skill Development and Entrepreneurship. *Pradhan Mantri Kaushal Vikas Yojana (PMKVY) — Official Portal*. https://www.pmkvyofficial.org/ (accessed 2026).

[15] Ministry of Rural Development. *Deendayal Antyodaya Yojana – National Rural Livelihoods Mission (DAY-NRLM) — Aajeevika Portal*. https://aajeevika.gov.in/ (accessed 2026).

[16] Ministry of Micro, Small & Medium Enterprises. *Udyam Registration Portal and MSME Classification Notification under the MSMED Act, 2006*. https://udyamregistration.gov.in/ (accessed 2026).

---

## Appendix A — Application links as stored in the seed

| # | Scheme | `application_link` |
|---|---|---|
| 1 | PMEGP | https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp |
| 2 | Mudra Shishu (PMMY) | https://www.mudra.org.in/ |
| 3 | Mudra Kishor (PMMY) | https://www.mudra.org.in/ |
| 4 | Mudra Tarun (PMMY) | https://www.mudra.org.in/ |
| 5 | Stand-Up India | https://www.standupmitra.in/ |
| 6 | PM SVANidhi | https://pmsvanidhi.mohua.gov.in/ |
| 7 | PM-AJAY | https://socialjustice.gov.in/ |
| 8 | NSFDC | https://nsfdc.nic.in/ |
| 9 | NSTFDC | https://www.nstfdc.nic.in/ |
| 10 | Mahila Samridhi Yojana | https://socialjustice.gov.in/ |
| 11 | Udyam Sakhi | https://udyamsakhi.org/ |
| 12 | PMKVY | https://www.pmkvyofficial.org/ |
| 13 | DAY-NRLM | https://aajeevika.gov.in/ |
| 14 | CGTMSE | https://www.cgtmse.in/ |
| 15 | KVIC Honey Mission | https://kvic.gov.in/kvicres/bee-keeping.php |
