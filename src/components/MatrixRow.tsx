return (
  <div className="matrix-row">
    {row.map((value, columnIndex) => (
      <input
        className="matrix-cell"
        key={columnIndex}
        type="text"
        value={value}
        onChange={(event) => {
          const value = Number(event.target.value)

          dispatch({
            type: 'SET_CELL',
            row: rowIndex,
            column: columnIndex,
            value,
          })
        }}
      />
    ))}
  </div>
)
