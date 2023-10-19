$(document).ready(function() {
    $.getJSON('/products/all', function(data) {
        let temp = 0
        let i = 0;
        while(data[i] != undefined) {
            if(i % 5 == 0) {
                let newDiv = `
                    <div id="row-${temp}" class="productClass"></div>
                `
                $('#productsContainer').append(newDiv)
                temp++;
            }
            let newPro = `
            <a href="/products/detail/${data[i]._id}">
                <div class="product" id="${data[i]._id}">
                    <img class="card-img-top" src="data:image/png;base64,${data[i].img}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${data[i].title}</h5>
                        <p class="card-text">${data[i].desc}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">${data[i].price}</small>
                    </div>
                </div>
            </a>
            `
            $(`#row-${temp - 1}`).append(newPro)
            i++
        }
    })
});