async function loadUsers() {
    // elements
    const userIDInput = document.querySelector('#userID-input');

    const id = userIDInput.value;
    const props = id ? `/${id}` : '?pageSize=16';

    const res = await fetch(`/api/users${props}`, {
        method: 'GET',
        headers: {
            'x-auth': 1001
        }
    });

    const data = await res.json();

    sessionStorage.setItem('users', JSON.stringify(data));

    showUsersTable(data);
}

function showUsersTable(userArray) {
    let html = ` 
        <table> 
            <tr> 
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
            </tr> 
            ${userArray
                .map(
                    user => `
                        <tr> 
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>
                                <a
                                    class="btn btn-primary"
                                    href="#"
                                    role="button"
                                    onclick = "editUser('${user.id}')"
                                    ><i class="bi bi-pencil-fill"></i>
                                </a>

                                <a
                                    class="btn btn-primary"
                                    href="#"
                                    role="button"
                                    onclick = "deleteUser('${user.id}')"
                                    ><i class="bi bi-trash3-fill"></i>
                                </a>

                            </td>
                        </tr>
                `
                )
                .join('')}
        </table>
        `;

    document.querySelector('#info').innerHTML = html;
}

function editUser(id) {
    // Elements
    const modal = document.getElementById('modal');

    const users = JSON.parse(sessionStorage.getItem('users'));

    const user = users.find(u => u.id == id);

    const newModal = new bootstrap.Modal(modal, {});

    document.querySelector('#id').value = user.id;
    document.querySelector('#name').value = user.name;
    document.querySelector('#email').value = user.email;

    newModal.show();
}

function deleteUser() {
    //https://sweetalert.js.org/
    swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this user record',
        icon: 'warning',
        buttons: true,
        dangerMode: true
    }).then(willDelete => {
        if (willDelete) {
            swal('The user has been deleted!', {
                icon: 'success'
            });
        } else {
            swal('The user is safe!');
        }
    });
}

async function editUser() {
    const id = document.querySelector('#id').value;
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;

    const userData = { name, email };

    const resp = await fetch('/api/users/' + id, {
        headers: {
            'x-auth': '23432',
            'content-type': 'Application/json'
        },
        method: 'PUT',
        body: JSON.stringify(userData)
    });

    const data = await resp.json();

    if (!data.error) {
        swal('Data Updated', 'User:' + data.name + ' updated', 'success');
        loadData();
    } else {
        swal('Error', data.error, 'error');
    }
}
