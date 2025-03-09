pragma solidity ^0.5.0;

contract ToDoList {
    uint public taskCount = 0;

    struct Task{
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated (
        uint id,
        string content,
        bool completed
    );

    event ToggleCompleted (
        uint id,
        bool completed
    );

    constructor() public {
        createTask("Complete SE SRS!");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id]=_task;
        emit ToggleCompleted(_id, _task.completed);
    }
}