import { ethers } from "./ethers.js";

const connectButton = document.getElementById('connectButton');
const registerButton = document.getElementById('registerButton');
const standingsTable = document.getElementById('standingsTable');

const candidateData = [
  { name: 'Candidate 1', votes: 10 },
  { name: 'Candidate 2', votes: 7 },
  { name: 'Candidate 3', votes: 15 },
  { name: 'Candidate 4', votes: 5 },
];
// Check if MetaMask exists
if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask is installed!');
}

connectButton.onclick = async function () {
  try {
    // Request MetaMask to connect
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Check if user granted access to accounts
    if (accounts.length === 0) {
      alert("Please connect your MetaMask account.");
    } else {
      // User is connected, redirect to election.html
      window.alert("Successfully connected to MetaMask Wallet.");
      window.location.href = "election1.html";
    }
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    alert("An error occurred while connecting to MetaMask. Please try again.");
  }
};

registerButton.onclick = async function () {
  try {
    // Request MetaMask to connect
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Check if user granted access to accounts
    if (accounts.length === 0) {
      alert("Please connect your MetaMask account to register.");
    } else {
      // User is connected, perform registration logic (e.g., store the registered account)
      window.alert("Successfully registered with MetaMask!");
      // You can add additional logic here, such as storing the registered account on a server or blockchain.
    }
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    alert("An error occurred while registering with MetaMask. Please try again.");
  }
  updateStandingsTable(candidateData);
};
function updateStandingsTable(data) {
  // Clear the existing table content
  standingsTable.innerHTML = `
    <tr>
      <th>Candidate Name</th>
      <th>Number of Votes</th>
    </tr>
  `;

  // Loop through the candidate data and add rows to the table
  data.forEach(candidate => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const votesCell = document.createElement('td');

    nameCell.textContent = candidate.name;
    votesCell.textContent = candidate.votes;

    row.appendChild(nameCell);
    row.appendChild(votesCell);

    standingsTable.appendChild(row);
  });
}
