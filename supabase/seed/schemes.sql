-- ============================================================
-- Seed: schemes.sql
-- 15 real Indian government schemes with accurate eligibility rules
-- Run AFTER 001_init.sql migration
-- ============================================================

INSERT INTO schemes (id, name, description, benefit_summary, eligibility_rules, application_link) VALUES

-- 1. PMEGP
(
  uuid_generate_v4(),
  'PMEGP - Prime Minister''s Employment Generation Programme',
  'A credit-linked subsidy programme for setting up new micro-enterprises in non-farm sector. Implemented by KVIC through banks.',
  'Subsidy of 15-35% of project cost (max ₹25 lakh for manufacturing, ₹10 lakh for service). Rest is bank loan.',
  '{
    "income_max": 10000000,
    "sector": ["manufacturing", "services", "retail", "food_processing", "handicrafts", "textile"],
    "loan_amount_max": 2500000,
    "loan_amount_min": 100000
  }'::jsonb,
  'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp'
),

-- 2. Mudra Shishu
(
  uuid_generate_v4(),
  'Mudra Shishu Loan (PMMY)',
  'Pradhan Mantri Mudra Yojana - Shishu category provides collateral-free loans up to ₹50,000 for small/micro businesses.',
  'Collateral-free loans up to ₹50,000 for starting or growing micro-enterprises. Low interest rate, no processing fee.',
  '{
    "income_max": 2500000,
    "loan_amount_max": 50000,
    "loan_amount_min": 1000
  }'::jsonb,
  'https://www.mudra.org.in/'
),

-- 3. Mudra Kishor
(
  uuid_generate_v4(),
  'Mudra Kishor Loan (PMMY)',
  'Pradhan Mantri Mudra Yojana - Kishor category provides collateral-free loans from ₹50,001 to ₹5 lakh for growing businesses.',
  'Collateral-free loans between ₹50,001 and ₹5 lakh for growing enterprises.',
  '{
    "income_max": 5000000,
    "loan_amount_max": 500000,
    "loan_amount_min": 50001
  }'::jsonb,
  'https://www.mudra.org.in/'
),

-- 4. Mudra Tarun
(
  uuid_generate_v4(),
  'Mudra Tarun Loan (PMMY)',
  'Pradhan Mantri Mudra Yojana - Tarun category provides loans from ₹5 lakh to ₹10 lakh for established micro-enterprises.',
  'Loans between ₹5 lakh and ₹10 lakh for established micro/small businesses.',
  '{
    "income_max": 15000000,
    "loan_amount_max": 1000000,
    "loan_amount_min": 500001
  }'::jsonb,
  'https://www.mudra.org.in/'
),

-- 5. Stand-Up India
(
  uuid_generate_v4(),
  'Stand-Up India Scheme',
  'Provides bank loans between ₹10 lakh and ₹1 crore to at least one SC/ST borrower and one woman borrower per bank branch for greenfield enterprises.',
  'Bank loans of ₹10 lakh to ₹1 crore for setting up new enterprises in manufacturing, services or trading sector.',
  '{
    "category": ["sc", "st"],
    "loan_amount_max": 10000000,
    "loan_amount_min": 1000000,
    "sector": ["manufacturing", "services", "trading"]
  }'::jsonb,
  'https://www.standupmitra.in/'
),

-- 6. PM SVANidhi (street vendors)
(
  uuid_generate_v4(),
  'PM SVANidhi - PM Street Vendor''s AtmaNirbhar Nidhi',
  'Micro-credit scheme for street vendors to avail affordable working capital loans and enable them to resume their livelihoods post-COVID.',
  'Collateral-free working capital loans starting at ₹10,000, scaling to ₹20,000 and ₹50,000 on timely repayment.',
  '{
    "sector": ["street_vending", "retail", "food_services"],
    "loan_amount_max": 50000,
    "loan_amount_min": 10000
  }'::jsonb,
  'https://pmsvanidhi.mohua.gov.in/'
),

-- 7. PM-AJAY
(
  uuid_generate_v4(),
  'PM-AJAY - Pradhan Mantri Anusuchit Jaati Abhyuday Yojana',
  'Comprehensive programme for the socio-economic development of SC communities. Merges SCDP, PMKVY-SC, and Babu Jagjivan Ram Chhatrawas Yojana.',
  'Skill training, employment, and entrepreneurship development for SC communities. Income support, livelihood interventions.',
  '{
    "category": ["sc"],
    "income_max": 2500000
  }'::jsonb,
  'https://socialjustice.gov.in/'
),

-- 8. NSFDC Scheme
(
  uuid_generate_v4(),
  'NSFDC - National Scheduled Castes Finance and Development Corporation',
  'Provides concessional finance to SC persons living below double the poverty line for income-generating activities.',
  'Term loans at 6% per annum for income-generating activities. Covers agriculture, small business, transport, technical trade.',
  '{
    "category": ["sc"],
    "income_max": 300000,
    "loan_amount_max": 1500000,
    "loan_amount_min": 10000
  }'::jsonb,
  'https://nsfdc.nic.in/'
),

-- 9. NSTFDC Scheme
(
  uuid_generate_v4(),
  'NSTFDC - National Scheduled Tribes Finance and Development Corporation',
  'Financial assistance for income-generating activities for ST persons living at or below twice the poverty line.',
  'Concessional loans at 6-8% interest for tribal entrepreneurs. Covers agriculture, forestry, handicrafts, small enterprises.',
  '{
    "category": ["st"],
    "income_max": 400000,
    "loan_amount_max": 2000000,
    "loan_amount_min": 10000,
    "sector": ["agriculture", "forestry", "handicrafts", "manufacturing", "services"]
  }'::jsonb,
  'https://www.nstfdc.nic.in/'
),

-- 10. Mahila Samridhi Yojana
(
  uuid_generate_v4(),
  'Mahila Samridhi Yojana',
  'Micro-finance scheme for women beneficiaries from SC communities. Provides micro-credit through Self Help Groups (SHGs) and NGOs.',
  'Micro-credit up to ₹1.4 lakh at 4% interest for women entrepreneurs. For income-generating activities.',
  '{
    "gender": "female",
    "category": ["sc"],
    "income_max": 300000,
    "loan_amount_max": 140000,
    "loan_amount_min": 5000
  }'::jsonb,
  'https://socialjustice.gov.in/'
),

-- 11. Udyam Sakhi
(
  uuid_generate_v4(),
  'Udyam Sakhi - Women Entrepreneurship Portal',
  'A dedicated portal and scheme ecosystem for women entrepreneurs providing skill training, mentorship, market access, and credit facilitation.',
  'Combines training, mentorship, and loan facilitation for women starting or growing businesses.',
  '{
    "gender": "female",
    "income_max": 10000000
  }'::jsonb,
  'https://udyamsakhi.org/'
),

-- 12. PMKVY - Skill India
(
  uuid_generate_v4(),
  'PMKVY - Pradhan Mantri Kaushal Vikas Yojana (Skill India)',
  'Flagship scheme for skill development and certification. Provides short-duration skill training and Recognition of Prior Learning (RPL).',
  'Free skill training and certification in 300+ job roles. Monetary reward of ₹8,000 on certification. Job placement assistance.',
  '{
    "income_max": 5000000
  }'::jsonb,
  'https://www.pmkvyofficial.org/'
),

-- 13. DAY-NRLM
(
  uuid_generate_v4(),
  'DAY-NRLM - Deendayal Antyodaya Yojana National Rural Livelihoods Mission',
  'Poverty alleviation programme for rural poor through SHG federation, skill training, and financial inclusion. Focuses on women and marginalized communities.',
  'Interest subvention on SHG loans, revolving fund support, community investment fund. Credit at 7% interest for women SHGs.',
  '{
    "gender": "female",
    "income_max": 200000,
    "sector": ["agriculture", "handicrafts", "food_processing", "retail", "services"]
  }'::jsonb,
  'https://aajeevika.gov.in/'
),

-- 14. CGTMSE
(
  uuid_generate_v4(),
  'CGTMSE - Credit Guarantee Fund Trust for Micro and Small Enterprises',
  'Provides credit guarantee to banks and financial institutions for loans to MSMEs without collateral or third-party guarantee.',
  'Credit guarantee coverage of 75-85% of loan amount (up to ₹5 crore) for collateral-free loans to MSMEs.',
  '{
    "sector": ["manufacturing", "services", "retail", "food_processing", "technology"],
    "loan_amount_max": 50000000,
    "loan_amount_min": 10000
  }'::jsonb,
  'https://www.cgtmse.in/'
),

-- 15. KVIC Honey Mission
(
  uuid_generate_v4(),
  'KVIC Honey Mission - National Bee Board',
  'Promotes scientific beekeeping and honey production for rural livelihoods. Provides training, beehives, and equipment to farmers and rural entrepreneurs.',
  'Free training, 50 beehive colonies, equipment, and market linkage for rural beekeepers. Income from honey and allied bee products.',
  '{
    "sector": ["agriculture", "beekeeping", "rural_livelihood"],
    "income_max": 1200000
  }'::jsonb,
  'https://kvic.gov.in/kvicres/bee-keeping.php'
);
