function reloadData() {
    $(document).ready(function() {
        $('#productsContainer')[0].innerHTML = ''
        let searchQuery = document.getElementById('searchQuery').value
        let temp = searchQuery
        let flag = false
        searchQuery = searchQuery.split(' ')
        $.getJSON('/products/all', function(data) {
            if(temp == '') flag = true
            let i = 0;
            while(data[i] != undefined) {
                let j = 0;
                let k = 0;
                while(data[i].tags[j] != undefined) {
                    while(searchQuery[k] != undefined) {
                        if(data[i].tags[j] == searchQuery[k] || flag) {
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
                            $('#productsContainer').append(newPro)
                        }
                        k++;
                    }
                    j++
                }
                i++
            }
        })
    });
}