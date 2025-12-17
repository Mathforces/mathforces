--Amr here--
# API Rules
(All the following urls are /api/(the url in the doc) )

## Contests (id here is contest_id)
- /contests/[contest_id] (returns all properties of contest)
- /contest/[contest_id]/problems (returns a summary of the problems (REST OF PROBLEMS' DATA CAN BE RETREIVED BELOW))
- /contest/[contest_id]/discussions (returns all discussions about this contest)
- /contest/[contest_id]/registered_in_contest (returns the summary of user info of all registered users in a contest)
- /contest/[contest_id]/standings (returns the leaderboard in a contest)

## Problems (id here is problem id)
- /problems/[problem_id] (returns the full info on a problem) 
- /problems/[problem_id]/discussions (returns the discussions on this problem only)
- /problems[problem_id]/editorials (returns all non-official editorials on a problem (The official one can be found on the properties of each problem))
- /problems/[problem_id]/submissions/[user_id] (returns all submissions of a user to a problem)
