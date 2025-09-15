import { Button, Col, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ExportButton from "../ExportButton";
import styles from "./BuyerActions.module.css";

interface BuyerImportExportProps {
  filters: {
    page?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
    search?: string;
  };
}

const BuyerImportExport = ({ filters }: BuyerImportExportProps) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const handleImport = async () => {
    if (!csvFile) return;
    
    setIsImporting(true);
    try {
      const fd = new FormData();
      fd.append("file", csvFile);
      const res = await fetch("/api/buyers/import", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      console.log(data);
      
      if (data.ok) {
        setCsvFile(null);
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }

        messageApi.open({
          type: 'success',
          content: 'CSV imported successfully',
        });

        setTimeout(() => {
          router.refresh();
        }, 500);
      } else {
        messageApi.open({
          type: 'error',
          content: data.message,
        });
      }
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: 'error',
        content: 'Failed to import CSV file',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  return (
    <>
      {contextHolder}
      <Col>
        <input
          type="file"
          accept=".csv, text/csv"
          onChange={handleCsvChange}
          className={styles.fileInput}
        />
      </Col>
      <Col>
        <Button
          onClick={handleImport}
          disabled={!csvFile || isImporting}
          loading={isImporting}
          className={`${styles.importButton} ${csvFile && !isImporting ? styles.importButtonActive : styles.importButtonInactive}`}
        >
          {isImporting ? 'Importing...' : 'Import CSV'}
        </Button>
      </Col>
      <Col>
        <ExportButton filters={filters} />
      </Col>
    </>
  );
};

export default BuyerImportExport;
