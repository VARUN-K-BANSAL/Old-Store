function tabChange(event, tabName) {
    let tabContent = document.getElementsByClassName('tabContent')
    let tabLinks = document.getElementsByClassName('tabLinks')

    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none"
    }
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "")
    }

    document.getElementById(tabName).style.display = "block"
    event.currentTarget.className += " active"
}

$(document).ready(function() {
    $.getJSON('/admin/getOrders', function(orders) {
        $.getJSON('/admin/getUsers', function(usersData) {
            $('#orders')[0].innerHTML = orders.length
            let users = 0;
            let admins = 0;
            let i = 0;
            while(usersData[i]) {
                if(usersData[i].isAdmin) admins++;
                else users++;
                i++;
            }
            $('#users')[0].innerHTML = users
            $('#admins')[0].innerHTML = admins
        })
    })

    $.getJSON('/admin/getReports', function(reports) {
        let i = 0;
        while(reports[i] != undefined) {
            if(reports[i].isResolved) {
                const newReport = `
                    <tr>
                        <td>${reports[i].complainer}</td>
                        <td>${reports[i].suspect}</td>
                        <td>${reports[i].message}</td>
                        <td><form action="/admin/removeSuspension/${reports[i].suspect}" method="GET" onsubmit="return confirmRemove()"><button type="submit" id="${reports[i].complainer}">Remove Suspension</button></form></td>
                    </tr>
                `
                $("#solvedTable").append(newReport)
            }
            else {
                const newReport = `
                    <tr>
                        <td>${reports[i].complainer}</td>
                        <td>${reports[i].suspect}</td>
                        <td>${reports[i].message}</td>
                        <td><form action="/admin/suspendUser/${reports[i].suspect}/${reports[i]._id}" method="GET" onsubmit="return confirmRemove()"><button type="submit" id="${reports[i].complainer}">Suspend User</button></form></td>
                    </tr>
                `
                $("#unsolvedTable").append(newReport);
            }
            i++;
        }
    })
})

function confirmRemove() {
    return confirm("Do you really want to suspend")
}