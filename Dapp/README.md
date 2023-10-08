# Final Assignment of Summer Project 'Mastering Web 3.0'

In this assignment we were asked to create a DApp for conducting Student Gymkhana Elections at our campus. Mayank and Shivansh have collaborated together to create the solution of this final assignment. 

The final website has been hosted on this link:[ exquisite-fenglisu-cbf03d.netlify.app.](https://venerable-croquembouche-6369a5.netlify.app/) In any case , if this link doesn't work one can run the index.html file itself from the repo use the website.

#### The following describes how this submitted workspace works:

## Smart Contract:

The smart contract has been written in solidity and has the following functionalities:
 - It contains of class **Candidate** whch is used to add identities of candidates that are going to contest for elections. They have attributes of _name_ and _totalVotes_ .
 - It also contains class **Voters** that contain information about voters and have attributes _registered_, _voted_, _candidateVotes_.
   - _registered_ is a bool function used to kep track of whether the voter is registered or not.
   * _voted_ is a bool function to keep track of whether the voter has already voted or not.
   * _candidateVotes_ is an array which takes indexes of three candidates as an input and assign 5,3 and 1 votes to to first,second and third entry repectively.

 - Next I have created a constructer which is called by owner of contract to register the candidates
 - Then there is function *registerVoter* which is called by voter to register himself to enable him to vote. It forsees that the caller is not already registered.
 - Then there is *castVote* function which gives voter a option to choose 3 candidates from given options and give them a priority order 1,2 and 3 which are given 5,3 and 1 votes respectively.
 - Then there is a function *winningCandidate* which on calling calculates to total votes and returns the index of winning candidate.
 - The last function is *winningCandidateName* which reveals the name of winning candidate.


## Front End

The file starts from index.html where one gets the GYMKHANA voting page

You need a metamask account to connect with it.

click on the connect to metamask account and the metamask extention will pop up 
![alt text](https://imgur.com/GcEdOa2.jpg)

once you have connected it will display a command promt saying you are connected
![alt text](https://imgur.com/XRDSWKK.jpg)

Now you will be directed to the voting page.

![alt text](https://imgur.com/rgwaPKz.jpg)

The voting page consists of 4 candidates(can be changed) wherein the images are responsive. You have to enter the indexes of the candidates you want to vote in order
According to our contract the first index will have 5 points second 3 and third 1.
You will not be able to enter if the index excess the number of candidates.

![alt text](https://imgur.com/A2ltjyR.jpg)


When entered the indexes, the user can register themselves as votes, this will allow the voter to vote only once and the account should be verified in order to vote. The prompts are added in the election.sol file.

![alt text](https://imgur.com/yq7a6Vl.jpg)
when voted the standing of the candidates will be refreshed and the name of the candidates and the total number of vote will be displayed


