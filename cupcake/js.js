const BASE_URL = 'http://localhost:5000/api';

function gencake(cupcake) {
    return `
    <div data-cake-id=${cupcake.id}>
        <li>
            ${cupcake.flavor} / ${cupcake.size} / ${cupcake.rating}
            <button class='del-btn'>Delete</button>
        </li>
        <img class='cake-img' src='${cupcake.image}' alt='(no image provided)'>
    </div>`;
}

async function showcake() {
    const response = await axios.get(`${BASE_URL}/cupcakes`);
    for (let cakeData of response.data.cupcakes) {
        let newcake = $(gencake(cakeData));
        $('#cupcakes-list').append(newcake);
    }
}

$('#new-cake').on('submit', async function(evt) {
    evt.preventDefault();
    let flavor = $('#form-flavor').val();
    let rating = $('#form-rating').val();
    let size = $('#form-size').val();
    let image = $('#form-image').val();

    const newcakeResp = await axios.post(`${BASE_URL}/cupcakes`, {
        flavor,
        rating,
        size,
        image
    });
    let newcake = $(gencake(newcakeResp.data.cupcake));
    $('#cupcakes-list').append(newcake);
    $('#new-cake').trigger('reset');
});

$('#cupcakes-list').on('click', '.del-btn', async function(evt) {
    evt.preventDefault();
    let $cupcake = $(evt.target).closest('div');
    let cupcakeId = $cupcake.attr('data-cake-id');
    await axios.delete(`${BASE_URL}/cupcakes/${cupcakeId}`);
    $cupcake.remove();
});

$(showcake);
