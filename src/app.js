
const App = {
  loading: false,
  contracts: {},

  load: async () => {
    try {
      await App.loadWeb3();
      await App.loadAccount();
      await App.loadContract();
      await App.render();
    } catch (error) {
      console.error("Error loading app:", error);
    }
  },

  loadWeb3: async () => {
    if (window.ethereum) {
      // Modern dapp browsers
      App.web3Provider = window.ethereum;
      window.web3 = new Web3(window.ethereum);
  
      try {
        // Request account access (replacement for ethereum.enable())
        await window.ethereum.request({ method: "eth_requestAccounts" });
  
        console.log("MetaMask connected:", await web3.eth.getAccounts());
      } catch (error) {
        console.error("User denied account access:", error);
      }
    } 
    else if (window.web3) {
      // Legacy dapp browsers
      App.web3Provider = window.web3.currentProvider;
      window.web3 = new Web3(window.web3.currentProvider);
  
      console.log("Legacy Web3 provider detected.");
    } 
    else {
      // Non-dapp browsers
      console.log("Non-Ethereum browser detected. Consider installing MetaMask!");
    }
  },

  loadAccount: async () => {
    const accounts = await web3.eth.getAccounts();
    App.account = accounts[0];
    console.log("Connected Account:", App.account);
  },

  loadContract: async () => {
    try {
      const todoListJson = await fetch('/contracts/TodoList.json').then(res => res.json());

      // Use @truffle/contract
      App.contracts.TodoList = TruffleContract(todoListJson);
      App.contracts.TodoList.setProvider(App.web3Provider);

      App.todoList = await App.contracts.TodoList.deployed();
      console.log("Smart Contract Loaded:", App.todoList);
    } catch (error) {
      console.error("Error loading contract:", error);
    }
  },

  render : async() => {

    //Prevent double rendering
    if(App.loading){
      return
    }

    App.setLoading(true)

    //Render account
    $('#account').html(App.account);

    await App.renderTasks();
  
    App.setLoading(false)
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },

  renderTasks: async() => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      // .on('click', App.toggleCompleted)

      // Put the task in the correct list
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show()
    }
  }, 

  createTask: async (event) => {
    if (event) event.preventDefault(); // Prevent form submission

    try {
      const taskContent = document.getElementById("newTask").value;
      if (!taskContent) return;

      console.log("Creating Task:", taskContent);

      // Assuming contract interaction (e.g., sending transaction)
      await App.todoList.createTask(taskContent, { from: App.account });

      // Clear input field after task is created
      document.getElementById("newTask").value = "";

      window.location.reload();

    } catch (error) {
      console.error("Error creating task:", error);
    }
  },
};

// Run when the page loads
document.addEventListener("DOMContentLoaded", () => {
  App.load();
  document.getElementById("taskForm").addEventListener("submit", App.createTask);
});

export default App;
