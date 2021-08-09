import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useEffect, useState, useRef } from "react";

let allCustomers;

const Customers = () => {
    const [customers, setCustomers] = useState(null);
    const table = useRef(null);
    const [zipCode, setZipCode] = useState("");
    const [totalPages, setTotalPages] = useState(null);
    const [currentPageNum, setCurrentPageNum] = useState(1);
    const [searchInput, setSearchInput] = useState("");        

    useEffect(() => {
        // console.log("run");
        (async () => {
            const response = await fetch(
                `http://localhost:3001/customers/${currentPageNum}`, 
                {
                    method: "GET",
                    headers: {
                        email: localStorage.email,
                        password: localStorage.password,
                    },
                }
            );
            const data = await response.json();
            // console.log(Math.ceil(data.customers.count / 5));
            setTotalPages(Math.ceil(data.customers.count / 5));
            setCustomers(data.customers.rows);
            allCustomers = data.customers.rows;
        })();
    }, [currentPageNum]);

    const addCustomer = async (evt) => {
        evt.preventDefault();
        // const firstName = evt.target.firstName.value;
        // const lastame = evt.target.lastame.value;
        // const phoneNumber = evt.target.phoneNumber.value;
        // const address1 = evt.target.address1.value;
        // const address2 = evt.target.address2.value;
        // const city = evt.target.city.value;
        // const state = evt.target.state.value;
        // const zipCode = evt.target.zipCode.value;

        let formData = {};

        for (const formField of evt.target) {
            if (formField.id) {
                formData[formField.id] = formField.value;
                formField.value = "";
            }
        }

        formData.zipCode = zipCode;

        if (formData.zipCode.length < 5) {
            alert("Your zip code is too short");
        } else if (formData.phoneNumber.length < 10) {
            alert("Your phone number is too short");
        } else {
            const response = await fetch(
                `http://localhost:3001/customers`, 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        email: localStorage.email,
                        password: localStorage.password,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();
            
            if (data.error) {
                alert(data.error);
            } else {
                setCustomers(data.customers);
                table.current.scrollIntoView();

                for (const formField of evt.target) {
                    formField.value = "";
                }
            } 
        }
    };

    let paginationLis = [];

    if (totalPages) {
        for (let i = 1; i <= totalPages; i++){
            paginationLis.push(
                <li 
                    className={`page-item ${currentPageNum === i ? "active" : ""}`} 
                    key={i}
                    onClick={() => {
                        setCurrentPageNum(i);
                    }}
                >
                    <span className="page-link">
                        {i}
                    </span>
                </li>
            ); 
        }
    }

    //search frontend
    // const searchNames = (evt) => {
    //     evt.preventDefault();
    //     // console.log(searchInput);
    //     if (searchInput === "") {
    //         setCustomers(allCustomers);
    //     } else {
    //         setCustomers(
    //             customers.filter((customer) => {
    //                 return (
    //                     customer.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
    //                     customer.lastame.toLowerCase().includes(searchInput.toLowerCase())
    //                 );
    //             })
    //         );
    //     }
    // };

    //backend search
    const searchNames = async (evt) => {
        evt.preventDefault();
        const response = await fetch(
            `http://localhost:3001/customersSearch`, 
            {
                method: "POST",
                header: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ searchQuery: searchInput }),
            }
        );
        const data = await response.json();
        // console.log(data);
        setCustomers(data.customers);
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-3" style={{ paddingLeft: 0 }}>
                        <Sidebar />
                    </div>
                    <div className="col-9"> 
                        <div style={{ textAlign: "center" }}>
                            <h3 
                                style={{ 
                                    textDecoration: "underline", 
                                    fontWeight: 700 
                                }} 
                            >
                                Customers
                            </h3>
                        </div>
                        <form 
                            className="row"
                            style={{
                                marginTop: 10,
                                marginBottom: 10
                            }}
                            onSubmit={searchNames}
                        >
                            <div className="col-10">
                                <input 
                                    type="text" 
                                    onChange={(evt) => {
                                        setSearchInput(evt.target.value);
                                    }}
                                    value={searchInput}
                                    className="form-control"
                                    placeholder="Search by name"
                                ></input>
                            </div>
                            <div className="col-2">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                >
                                    Search
                                </button>
                            </div>
                        </form>

                        <div 
                            style={{ 
                                maxHeight: 350, 
                                overflow: "scroll" 
                            }} 
                        >                    
                            <table 
                                className="table table-striped table-hover" 
                                style={{ 
                                    border: "1px solid black" 
                                }}
                                ref={table}
                            >
                                <thead style={{ textAlign: "center" }}>
                                    <tr>
                                        <th scope="col">First Name</th>
                                        <th scope="col">Last Name</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Address</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers ? (
                                        customers.map(customer => {
                                            // console.log(customer);
                                            return (
                                                <tr key={customer.customerID}>
                                                    <td>{customer.firstName}</td>
                                                    <td>{customer.lastame}</td>
                                                    <td>{customer.phoneNumber}</td>
                                                    <td>{customer.address1}
                                                        {customer.address2 
                                                            ? `, ${customer.address2}`
                                                            : ""}, 
                                                        {customer.city}, 
                                                        {customer.state}, 
                                                        {customer.zipCode}
                                                    </td>
                                                    <td>✏️&nbsp;&nbsp;&nbsp;🗑</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td>Loading...</td>
                                        </tr>
                                    )}
                                    {/* <tr>
                                        <td>Another</td>
                                        <td>Person</td>
                                        <td>123-456-7890</td>
                                        <td>123 Main St, Town, NY 12345</td>
                                        <td>✏️&nbsp;&nbsp;&nbsp;🗑</td>
                                    </tr>
                                    <tr>
                                        <td>Another</td>
                                        <td>Person</td>
                                        <td>123-456-7890</td>
                                        <td>123 Main St, Town, NY 12345</td>
                                        <td>✏️&nbsp;&nbsp;&nbsp;🗑</td>
                                    </tr>
                                    <tr>
                                        <td>Another</td>
                                        <td>Person</td>
                                        <td>123-456-7890</td>
                                        <td>123 Main St, Town, NY 12345</td>
                                        <td>✏️&nbsp;&nbsp;&nbsp;🗑</td>
                                    </tr> */}
                                </tbody>
                            </table>
                        </div>
                        {totalPages < 2 ? null : (
                            <nav aria-label="Page navigation">
                                <ul className="pagination">
                                    <li 
                                        className={`page-item ${
                                            currentPageNum === 1 ? "disabled" : ""
                                        }`}
                                    >
                                        <span 
                                            className="page-link"
                                            onClick={() => {
                                                setCurrentPageNum(currentPageNum - 1);
                                            }}
                                        >
                                            Previous
                                        </span>
                                    </li>
                                    {paginationLis}
                                    <li 
                                        className={`page-item ${
                                            currentPageNum === totalPages ? "disabled" : ""
                                        }`}
                                    >
                                        <span 
                                            className="page-link"
                                            onClick={() => {
                                                setCurrentPageNum(currentPageNum + 1);
                                            }}
                                        >
                                            Next
                                        </span>
                                    </li>
                                </ul>
                            </nav>
                        )}
                        <div style={{ testAlign: "center" }}>
                            <h3 style={{ textDecoration: "underline" }} >
                                Add Customer
                            </h3>
                        </div>
                        <form onSubmit={addCustomer}>
                            <div className="row">
                                <div className="col">
                                    <div className="mb-3">
                                        <label 
                                            htmlFor="firstName"    
                                            className="form-label"
                                        >
                                            First Name:
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="firstName" 
                                            placeholder="type first name here" 
                                            required
                                            tabIndex="1"
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                        <label 
                                            htmlFor="address1" 
                                            className="form-label"
                                        >
                                            Address Line 1:
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="address1" 
                                            placeholder="type address here" 
                                            required
                                            tabIndex="4"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="mb-3">
                                        <label 
                                            htmlFor="lastame" 
                                            className="form-label"
                                        >
                                            Last Name:
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="lastame" 
                                            placeholder="type last name here" 
                                            required
                                            tabIndex="2"
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                        <label 
                                            htmlFor="address2" 
                                            className="form-label"
                                        >
                                            Address Line 2:
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="address2" 
                                            placeholder="type apt or suite here" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label 
                                            htmlFor="phoneNumber" 
                                            className="form-label"
                                        >
                                            Phone Number:
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="phoneNumber" 
                                            placeholder="type phone number here"
                                            required 
                                            onBlur={(evt) => {
                                                const num = evt.target.value.trim();
                                                if (num.length === 10) {
                                                    evt.target.value = 
                                                        `(${num.substring(0, 3)}) 
                                                        ${num.substring(3, 6)}-${num.substring(6)}`;
                                                }
                                                
                                            }}
                                        />
                                    </div>
                                </div>    
                                <div className="col-3">
                                    <div className="mb-3">
                                        <label 
                                            htmlFor="city" 
                                            className="form-label"
                                        >
                                            City:
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="city" 
                                            placeholder="type city here" 
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="mb-3">
                                        <label 
                                            htmlFor="state" 
                                            className="form-label"
                                        >
                                            State
                                        </label>
                                        <select 
                                            className="form-select" 
                                            id="state" 
                                            defaultValue="NY"
                                            required
                                        >
                                            <option defaultValue></option>
                                            <option value="Alabama">AL</option>
                                            <option value="Alaska">AK</option>
                                            <option value="American Samoa">AS</option>
                                            <option value="Arizona">AZ</option>
                                            <option value="Arkansas">AR</option>
                                            <option value="California">CA</option>
                                            <option value="Colorado">CO</option>
                                            <option value="Connecticut">CT</option>
                                            <option value="Delaware">DE</option>
                                            <option value="District of Colombia">DC</option>
                                            <option value="Florida">FL</option>
                                            <option value="Georgia">GA</option>
                                            <option value="Guam">GU</option>
                                            <option value="Hawaii">HI</option>
                                            <option value="Idaho">ID</option>
                                            <option value="Illinois">IL</option>
                                            <option value="Indiana">IN</option>
                                            <option value="Iowa">IA</option>
                                            <option value="Kansas">KS</option>
                                            <option value="Kentucky">KY</option>
                                            <option value="Lousiana">LA</option>
                                            <option value="Maine">ME</option>
                                            <option value="Maryland">MD</option>
                                            <option value="Massachusetts">MA</option>
                                            <option value="Michigan">MI</option>
                                            <option value="Minnesota">MN</option>
                                            <option value="Mississippi">MS</option>
                                            <option value="Missouri">MO</option>
                                            <option value="Montana">MT</option>
                                            <option value="Nebraska">NE</option>
                                            <option value="Nevada">NV</option>
                                            <option value="New Hampshire">NH</option>
                                            <option value="New Jersey">NJ</option>
                                            <option value="New Mexico">NM</option>
                                            <option value="New York">NY</option>
                                            <option value="North Carolina">NC</option>
                                            <option value="North Dakota">ND</option>
                                            <option value="Northern Mariana Is">MP</option>
                                            <option value="Ohio">OH</option>
                                            <option value="Oklahoma">OK</option>
                                            <option value="Oregon">OR</option>
                                            <option value="Pennsylvania">PA</option>
                                            <option value="Puerto Rico">PR</option>
                                            <option value="Rhode Island">RI</option>
                                            <option value="South Carolina">SC</option>
                                            <option value="South Dakota">SD</option>
                                            <option value="Tennessee">TN</option>
                                            <option value="Texas">TX</option>
                                            <option value="Utah">UT</option>
                                            <option value="Vermont">VT</option>
                                            <option value="Virginia">VA</option>
                                            <option value="Virgin Islands">VI</option>
                                            <option value="Washington">WA</option>
                                            <option value="West Virginia">WV</option>
                                            <option value="Wisconsin">WI</option>
                                            <option value="Wyoming">WY</option>
                                        </select>
                                    </div>
                                </div>    
                            </div>
                            <div className="row">
                                <div className="col-9"></div>
                                <div className="col">    
                                    <div className="mb-3">
                                        <label 
                                            htmlFor="zipCode" 
                                            className="form-label"
                                        >
                                            Zip Code:
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="zipCode" 
                                            placeholder="Zip Code" 
                                            required
                                            value={zipCode}
                                            onChange={(evt) => {
                                                setZipCode(evt.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>    
                            <div className="row">
                                <div className="col text-center">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                    >
                                        Add Customer
                                    </button>
                                </div>
                            </div>    
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Customers;