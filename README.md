# BusTimer
For students who live further away from campus, it's often difficult to catch the inconsistent buses that rarely run on schedule. This is why I made BusTimer. Input the time you want to get on the bus. If you want to get on campus by 2 PM and you are 15 minutes away, put 1:45 PM. BusTimer pulls bus information using MTA's API to get an updated expected arrival time of the next bus. For my purposes it is set to the M101 bus at 14th and 3rd. Once you input your time, BusTimer will send an alert 5 minutes before the bus arrives.

# Setup
Simply enter ```npm start ``` into the terminal to run the project

# API
I used the OneBusAway API from NYC MTA. By giving it a bus line, I get a list of arrival times of the bus at the specific stop. I filter the times and only use the time closest but before the inputted user time.

# AI-generated Code
I used AI to generate the HTML returned by the app and to establish some logic used by the functions
