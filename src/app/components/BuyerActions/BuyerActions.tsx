"use client";

import { Row, ConfigProvider } from "antd";
import React from "react";
import BuyerSearchBar from "./BuyerSearchBar";
import BuyerFilters from "./BuyerFilters";
import BuyerActionButtons from "./BuyerActionButtons";
import BuyerImportExport from "./BuyerImportExport";
import { useBuyerFilters } from "./useBuyerFilters";
import styles from "./BuyerActions.module.css";
import { BuyerActionsProps } from "@/app/types/buyer";

const BuyerActions = ({ filters, filterOptions }: BuyerActionsProps) => {
  const { debouncedSearch, handleFilterChange } = useBuyerFilters();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#A9BD93',
          colorPrimaryHover: '#A9BD93',
          colorPrimaryActive: '#A9BD93',
        },
        components: {
          Input: {
            hoverBorderColor: '#A9BD93',
            activeBorderColor: '#A9BD93',
          },
          Select: {
            hoverBorderColor: '#A9BD93',
            activeBorderColor: '#A9BD93',
            optionSelectedBg: '#A9BD93',
            optionActiveBg: '#A9BD93',
          },
        },
      }}
    >
      <div className={styles.container}>
        <Row gutter={16} className={styles.filtersRow}>
          <BuyerSearchBar 
            initialValue={filters.search || ""} 
            onSearch={debouncedSearch}
          />
          <BuyerFilters 
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </Row>
        <Row gutter={16}>
          <BuyerImportExport filters={filters} />
          <BuyerActionButtons />
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default BuyerActions;
