import { Col, Select } from "antd";
import styles from "./BuyerActions.module.css";
import { BuyerFiltersProps } from "@/app/types/buyer";

const { Option } = Select;

const BuyerFilters = ({ filters, filterOptions, onFilterChange }: BuyerFiltersProps) => {
  return (
    <>
      <Col span={4}>
        <Select
          placeholder="City"
          className={styles.filterSelect}
          value={filters.city}
          onChange={(value) => onFilterChange("city", value)}
          allowClear
        >
          {filterOptions.cities.map((city) => (
            <Option key={city} value={city}>
              {city}
            </Option>
          ))}
        </Select>
      </Col>
      <Col span={4}>
        <Select
          placeholder="Property Type"
          className={styles.filterSelect}
          value={filters.propertyType}
          onChange={(value) => onFilterChange("propertyType", value)}
          allowClear
        >
          {filterOptions.propertyTypes.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
      </Col>
      <Col span={4}>
        <Select
          placeholder="Status"
          className={styles.filterSelect}
          value={filters.status}
          onChange={(value) => onFilterChange("status", value)}
          allowClear
        >
          {filterOptions.statuses.map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      </Col>
      <Col span={4}>
        <Select
          placeholder="Timeline"
          className={styles.filterSelect}
          value={filters.timeline}
          onChange={(value) => onFilterChange("timeline", value)}
          allowClear
        >
          {filterOptions.timelines.map((timeline) => (
            <Option key={timeline} value={timeline}>
              {timeline === "ZERO_3M"
                ? "0-3m"
                : timeline === "THREE_6M"
                ? "3-6m"
                : timeline === "GT_6M"
                ? ">6m"
                : timeline}
            </Option>
          ))}
        </Select>
      </Col>
    </>
  );
};

export default BuyerFilters;
