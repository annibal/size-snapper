import resizilla from 'resizilla';
// require('resizilla')

function SizeSnapper() {
    resizilla(
        (e) => {
            console.log(e)
        },
        15,
        false,
        false,
        true
    )

}

export default SizeSnapper