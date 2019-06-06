DragDropSort
============

## Useage

* In the react development, an example of the component DragDropSort is referenced:
```
class Demo extends Component {

  data() {
    return [{
      label: 'button'
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
      <DragDropSort data={data} callback={getReturnData} dragTag="button">
        {items}
      </DragDropSort>
    </div>
  }
}
```

## Options


* You can set the options to `drag-drop-sort`.
| Name | Type | Default | Description |
|:--:|:--:|:-----:|:----------|
|**`data`**|`{Array}`|`[]`|the Data used to render lists for sort.|
|**`callback`**|`{Array}`|`[]`|Returns sorted data.|
|**`dragTag`**|`{String}`|`undefined`|the tagName of the specified drag child element.|

* Here's an example webpack config illustrating how to use these options
```
<DragDropSort data={data} callback={getReturnData} dragTag="button">
  {items}
</DragDropSort>
```
Remark: The array element needs to contain the ***label*** attribute.


## Install

```
npm install drag-drop-sort --save
```
