# UBL Analytics Dashboard Audit

| # | Dashboard / Analysis | Status | Barriers / Blockers |
|---|---|---|---|
| 1 | **Standings Projection & Title Race** | ✅ Completed | Points-gap and elimination logic is live. |
| 2 | **Player Score Trend & Form Index** | 🔴 Not Started | Requires multiple weeks of historical `game_scores` (currently only have Wk 9/10). |
| 3 | **Individual Split Analysis** | ✅ Completed | Visualizes Game 1 vs Game 2 performance and "Sustainability Gaps." |
| 4 | **Head-to-Head Matchup Breakdown** | 🟡 Partial | "Top Threats" is built; full H2H matrix requires `matches` table population. |
| 5 | **Player Performance & Rankings** | ✅ Completed | Standard standings and top performers are live. |
| 6 | **Roster Attendance Heat Map** | 🔴 Not Started | Requires tracking "Absent" weeks (currently ingestion only handles bowlers who played). |
| 7 | **Most Improved Trajectory** | ✅ Completed | Integrated into competition analysis logic. |
| 8 | **High Game & Series Records** | ✅ Completed | Season HGS/HSS records are displayed in player cards/standings. |
| 9 | **Cross-Division Comparison** | ✅ Completed | "Division Benchmarks" dashboard built into the standings page. |
| 10 | **Team Consistency & Variance** | ✅ Completed | Identifies steady vs volatile teams based on G1/G2 variance. |
| 11 | **Lineup Contribution Analysis** | 🔴 Not Started | Requires mapping individual game scores to team totals per match. |
| 12 | **Remaining Schedule Difficulty** | ✅ Completed | Flags next opponent strength (Hard/Med/Easy). |
| 13 | **Women's Division Analysis** | ✅ Completed | Dedicated tracking for female elite performers. |
| 14 | **Pins Over Average (POA) Tracker** | ✅ Completed | Highlights top overperformers relative to their season average. |

## Major Barriers to Full Implementation
1. **Supabase Schema Lock**: Missing columns: `game1`, `game2`, `gender`, `series` in `ubl_bowler_stats` (or `game_scores`).
2. **Data History**: Needs multi-week trend for reliable "Form Index".
3. **Schedule Data**: `schedule` table needs population for projections.
