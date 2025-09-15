import { Col, Input } from "antd";
import { useState } from "react";
import styles from "./BuyerActions.module.css";
import { BuyerSearchBarProps } from "@/app/types/buyer";

const { Search } = Input;

const BuyerSearchBar = ({ initialValue, onSearch }: BuyerSearchBarProps) => {
  const [searchValue, setSearchValue] = useState(initialValue);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <Col span={6}>
      <Search
        placeholder="Search by name, phone, email, or notes"
        value={searchValue}
        onChange={handleSearchChange}
        allowClear
        className={styles.searchInput}
      />
    </Col>
  );
};

export default BuyerSearchBar;
