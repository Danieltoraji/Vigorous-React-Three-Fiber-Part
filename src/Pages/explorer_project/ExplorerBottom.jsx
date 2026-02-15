function ExplorerBottom(){
  return(
    <div>
        <p>重要提醒：理论上在界面更新数据后，数据会直接传送到后端中，随后Context从后端获得更新后的数据，界面会自动更新。</p>
        <p>但是我们的前后端还没串起来，所以更改后的数据会只留存于内存，刷新后消失，这是正常现象。</p>
    </div>
  )
}
export default ExplorerBottom