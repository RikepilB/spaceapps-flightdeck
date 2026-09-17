<!--
REGRESSION FIXTURE: 10 planted defects.
Do not "fix" this file. Its errors are the test.
Scoring key lives in evals/keys/exofinder.yaml
-->

Project: ExoFinder
Challenge: A World Away: Hunting for Exoplanets with AI

We built a machine learning model that detects new exoplanets from NASA's Kepler data.

Method: We downloaded the Kepler Objects of Interest (KOI) cumulative table from the NASA
Exoplanet Archive (9,564 rows). We used every numeric column in the table as a feature,
including koi_score, koi_pdisposition, koi_fpflag_nt, koi_fpflag_ss, koi_fpflag_co and
koi_fpflag_ec. We dropped rows with missing values in koi_period but kept koi_srad as-is
since it was fully populated. We trained a gradient boosted tree with an 80/20 random
train/test split.

Results: Our model achieves 99.2% accuracy in identifying exoplanets. This proves that
AI can replace manual vetting by astronomers.

The dashboard lets you enter a candidate's parameters and get a verdict. Our example
candidate KOI-7923.01 sits at RA 45.2, Dec 210.7 and has an equilibrium temperature of
450 degrees C, comfortably in the habitable zone.

Because Kepler surveyed a representative sample of the sky, our accuracy should generalise
to all stars in the galaxy, and we expect similar performance on TESS and on future
missions.

Impact: This will help astronomers find life beyond Earth.
