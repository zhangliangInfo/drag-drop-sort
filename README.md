DragDropSort
============

## Useage

* In the react development, an example of the component DragDropSort is referenced:
```
class Demo extends Component {

  data() {
    return [{
      name: 'button'
    }]
  }

  getReturnData(data) {
    <!-- get the sorted data, return data of type array -->
  }

  render() {
    let items = [];
    this.data.forEach(item => {
      items.push(<button>{item}</button>);
    });

    return <div>
      <DragDropSort data={data} callback={getReturnData}>
        {items}
      </DragDropSort>
    </div>
  }
}
```

## Install

```
npm install drag-drop-sort
```