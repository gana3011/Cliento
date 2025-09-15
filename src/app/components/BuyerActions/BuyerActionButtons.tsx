import { Button, Col } from "antd";
import Link from "next/link";
import styles from "./BuyerActions.module.css";

const BuyerActionButtons = () => {
  return (
    <Col>
      <Link href={"/buyers/new"}>
        <Button
          type="primary"
          className={styles.addButton}
        >
          Add Buyer
        </Button>
      </Link>
    </Col>
  );
};

export default BuyerActionButtons;
