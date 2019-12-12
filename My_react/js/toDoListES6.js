var taskId = 0;

class ToDoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task:      '',
            tasksList: [],
            filter:    'all',
        };
        this.changeTaskState = this.changeTaskState.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.storeTask = this.storeTask.bind(this);
        this.updateValue = this.updateValue.bind(this);
    }

    changeTaskState(taskId) {
        let tasks = this.state.tasksList.map((task) => {
            if (task.id === taskId) {
                task.checked = !task.checked;
            }
            return task;
        });

        this.setState({
            tasksList: tasks,
        });
    }

    setFilter(newFilter) {
        this.setState({
            filter: newFilter,
        });
    }

    storeTask(newTask) {
        let newTasksList = this.state.tasksList.slice();

        newTasksList.push({
            name:    newTask,
            checked: false,
            id:      ++taskId,
        });

        this.setState({
            tasksList: newTasksList,
            task:      '',
        });
    }

    updateValue(ev) {
        this.setState({
            task: ev.target.value,
        });
    }

    render() {
        let filters = <span>You dont  have any tasks now!</span>;
        let tasks = this.state.tasksList.slice();

        tasks = tasks.filter((task) => {
            if (this.state.filter === 'finished') {
                return task.checked;
            } else if (this.state.filter === 'unfinished') {
                return !task.checked;
            }

            return true;
        });

        if (this.state.tasksList.length) {
            filters = <Filters setFilter={this.setFilter} filter={this.state.filter}/>;
        }

        return (
            <div id='toDoList'>
                <h1>My Todo List:</h1>
                <CreateBlock updateValue={this.updateValue} task={this.state.task} clickHandler={this.storeTask}/>
                <hr/>
                <List tasks={tasks} changeHandler={this.changeTaskState}/>
                {filters}
            </div>
        );
    }
};

class CreateBlock extends React.Component {
    constructor(props) {
        super(props);
        this.taskInput = React.createRef();
        this.focusTaskInput = this.focusTaskInput.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.keyPressHandler = this.keyPressHandler.bind(this);
    }

    focusTaskInput() {
        this.taskInput.current.focus();
    }

    keyPressHandler(event) {
        if (event.key == 'Enter' && this.props.task.length) {
            this.props.clickHandler(this.props.task);
        }
    }

    clickHandler() {
        this.props.clickHandler(this.props.task);
        this.focusTaskInput();
    }

    render() {
        return (
            <div>
                <InputField refProp={this.taskInput} task={this.props.task} defaultValue=''
                            updateValue={this.props.updateValue} keyPressHandler={this.keyPressHandler}/>
                <input type='button' value='Create Task' className='toDoList_createBtn' onClick={this.clickHandler}
                       disabled={!this.props.task.length}/>
            </div>
        );
    }
};

const InputField = (props) => {
    return (
        <input ref={props.refProp} value={props.task} id='inputField' type='text' onKeyPress={props.keyPressHandler}
               onChange={props.updateValue} placeholder='Enter task name' autoFocus='true'/>
    );
};

const Filters = (props) => {
    return (
        <ul className="filters">
            <li>
                <a className={props.filter == 'all' ? 'active' : ''} onClick={() => {
                    props.setFilter('all');
                }}>all</a>
            </li>
            <li>
                <a className={props.filter == 'finished' ? 'active' : ''} onClick={() => {
                    props.setFilter('finished');
                }}>finished</a>
            </li>
            <li>
                <a className={props.filter == 'unfinished' ? 'active' : ''} onClick={() => {
                    props.setFilter('unfinished');
                }}>unfinished</a>
            </li>
        </ul>
    );
};

class List extends React.Component {
    render() {
        const { tasks, changeHandler } = this.props;
        let taskTemplate = tasks.map((task, index) => {
            return (
                <Task key={index} task={task} changeHandler={changeHandler}/>
            );
        });
        return (
            <ul className='toDoList'>
                {taskTemplate}
            </ul>
        );
    }
};

class Task extends React.Component {
    render() {
        const { task, changeHandler } = this.props;
        let isSelectedClass = task.checked ? ' is-selected' : '';
        let taskClassName = 'toDoList_task' + isSelectedClass;

        return (
            <li className={taskClassName}>
                <label>
                    <input type='checkbox' className='toDoList_check' checked={task.checked} onChange={() => {
                        changeHandler(task.id);
                    }}/>
                    <span>{task.name}</span>
                </label>
            </li>
        );
    }
};

ReactDOM.render(
    <ToDoList/>,
    document.getElementById('app')
);