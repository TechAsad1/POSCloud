import React, { useRef, useState } from "react";
import { PlusCircle } from "feather-icons-react/build/IconComponents";
import { MinusCircle } from "react-feather";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../img/imagewithbasebath";

const RowCompo = (p) => {
    const rowRefs = useRef({});
    const qtyRef = useRef();
    const [getTotal, setTotal] = useState();
    const removeRow = (id) => {
        if (rowRefs.current[id]) {
            rowRefs.current[id].remove();
            p.calculate();
        }
    };
    const handlePlus = async () => {
        let qty = Number(qtyRef.current.value);
        qty++;
        qtyRef.current.value = qty;
        setTotal(qty * p.cPrice);
        await new Promise((re) => setTimeout(re, 200));
        p.calculate();
    }
    const handleMinus = async () => {
        let qty = Number(qtyRef.current.value);
        if (qty > 1) {
            qty--;
            qtyRef.current.value = qty;
            setTotal(qty * p.cPrice);
            await new Promise((re) => setTimeout(re, 200));
            p.calculate();
        }
    }
    return (
        <>
            <tr key={p.id} ref={(el) => (rowRefs.current[p.id] = el)}>
                <td className="p-2" hidden>{p.id}</td>
                <td>
                    <div className="productimgname">
                        <Link to="#" className="product-img stock-img">
                            <img src={"https://localhost:7151/api/Product/getImg/" + p.img} alt="product" />
                        </Link>
                        {p.name}
                    </div>
                </td>
                <td>
                    <div className="product-quantity">
                        <span className="quantity-btn" onClick={handleMinus}>+<MinusCircle /></span>
                        <input type="text" ref={qtyRef} name="qtyText" className="quntity-input" defaultValue="1" />
                        <span className="quantity-btn" onClick={handlePlus}> <PlusCircle /></span>
                    </div>
                </td>
                <td className="p-2">{p.cPrice}</td>
                <td className="p-2"><input type="number" className="form-control" defaultValue={0} /></td>
                <td className="p-2">{p.gstPerc}</td>
                <td className="p-2">{p.gst}</td>
                <td className="p-2">{p.cPrice}</td>
                <td className="p-2">{getTotal}</td>
                <td>
                    <Link className="delete-set" onClick={() => removeRow(p.id)}><ImageWithBasePath src="assets/img/icons/delete.svg" alt="svg" /></Link>
                </td>
            </tr>
        </>
    )
}
export default RowCompo