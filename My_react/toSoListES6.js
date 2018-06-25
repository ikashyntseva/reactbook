/**
 * Created by Admin on 2018-06-25.
 */

var taskId = 0;

class ToDoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task: '',
            tasksList: [],
            filter: 'all',
        };
        this.changeTaskState = this.changeTaskState.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.storeTask = this.storeTask.bind(this);
        this.updateValue = this.updateValue.bind(this);
    }
    changeTaskState(taskId) {
        var tasks = this.state.tasksList.map((task)=>{
                if(task.id===taskId){
            task.checked = !task.checked;
        }
        return task;
    });
        this.setState({
            tasksList: tasks
        });
    }
    setFilter(newFilter) {
        this.setState({
            filter: newFilter
        })
    }
    storeTask(newTask) {
        var newTasksList = this.state.tasksList.slice();

        newTasksList.push({
            name: newTask,
            checked: false,
            id: ++taskId
        });

        this.setState({
            tasksList: newTasksList
        });
    }

    updateValue(ev) {
        this.setState({
            task: ev.target.value
        });
    }
    createTask() {

    }
    render () {
        let tasks = this.state.tasksList.slice();
        tasks = tasks.filter((task)=>{
                if(this.state.filter === 'finished'){
            return task.checked;
        } else if(this.state.filter === 'unfinished') {
            return !task.checked;
        }

        return true;
    });

        return (
            <div id='toDoList'>
            <h1>My Todo List:</h1>
        <CreateBlock updateValue={this.updateValue} task={this.state.task} clickHandler={this.storeTask} />
    <hr/>
        <List tasks={tasks} changeHandler={this.changeTaskState} />
    <Filters setFilter={this.setFilter} filter={this.state.filter} />
    </div>
    );
    }
};

const CreateBlock = (props) => {
    return (
        <div>
        <InputField updateValue={props.updateValue} />
<input type='button' value='Create Task' onClick={() => {props.clickHandler(props.task);}} disabled={!props.task.length} />
</div>
);
}

const InputField = (props) => {
    return (
        <input id='inputField' type='text' onChange={props.updateValue} />
);
}

const Filters = (props) => {
    return (
        <ul className="filters">
        <li>
        <a className={props.filter=='all'?'active':''} onClick={()=>{props.setFilter('all')}}>all</a>
    </li>
    <li>
    <a className={props.filter=='finished'?'active':''} onClick={()=>{props.setFilter('finished')}}>finished</a>
    </li>
    <li>
    <a className={props.filter=='unfinished'?'active':''} onClick={()=>{props.setFilter('unfinished')}}>unfinished</a>
    </li>
    </ul>
)
}

class List extends React.Component {
    render () {
        const {tasks, changeHandler} = this.props;
        var taskTemplate = tasks.map(function(task, index) {
            return (
                <Task key={index} task={task} changeHandler={changeHandler}  />
            )
        });
        return (
            <ul>
            {taskTemplate}
            </ul>
    );
    }
};

class Task extends React.Component {
    render () {
        const {task, changeHandler} = this.props;
        return (
            <li>
            <label>
            <input type='checkbox' checked={task.checked} onChange={()=>{changeHandler(task.id)}} />
            <span>{task.name}</span>
        </label>
        </li>
    );
    }
};

ReactDOM.render(
<ToDoList />,
    document.getElementById('app')
);
