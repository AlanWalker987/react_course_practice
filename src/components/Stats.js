export default function Stats({ items }) {

    if (!items.length) return
    (
        <p className='stats'>
            <em>
                Start adding items to your packing list ✈
            </em>
        </p>
    );

    const numOfItems = items.length;
    const packedItems = items.filter((item) => item.packed).length;
    const percentage = Math.round((packedItems / numOfItems * 100));

    return (
        <footer className='stats'>
            <em>
                {
                    percentage === 100 ? 'You got everthing! Ready to go✈' :
                        `You have ${numOfItems} items on your list, and you already packed ${packedItems} (${percentage}%)`
                }
            </em>
        </footer>
    )
}