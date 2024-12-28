"use client";

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckIcon, ClockIcon, FileDown, QrCode } from 'lucide-react';
import { DeleteCode } from './buttons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { QRCode as Code } from '@prisma/client';



interface CodesTableProps {
  codes: Code[];
  onUpdateStatus: (ids: string[]) => Promise<void>;
}

interface QRCodeOptions {
  type: 'svg' | 'utf8' | undefined;
  margin: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  color: {
    dark: string;
    light: string;
  };
}

const CodesTable: React.FC<CodesTableProps> = ({ codes, onUpdateStatus }) => {
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState<boolean>(false);
  
  const toggleSelectAll = (): void => {
    if (selectedCodes.size === codes.length) {
      setSelectedCodes(new Set());
    } else {
      setSelectedCodes(new Set(codes.map(code => code.id)));
    }
  };

  const toggleSelect = (id: string): void => {
    const newSelected = new Set(selectedCodes);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCodes(newSelected);
  };

  const exportToExcel = (): void => {
    const selectedData = codes.filter(code => selectedCodes.has(code.id));
    const ws = XLSX.utils.json_to_sheet(selectedData.map(code => ({
      Code: code.code,
      CreatedAt: new Date(code.createdAt).toLocaleDateString(),
      Status: code.copied ? 'Copied' : 'Pending'
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Codes');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'codes.xlsx');
  };

  const generateQRCodeSVG = async (text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const options: QRCodeOptions = {
        type: "svg",
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      };

      QRCode.toString(text, options, (err: Error | null | undefined, svg: string) => {
        if (err) reject(err);
        else resolve(svg);
      });
    });
  };

  const exportToQR = async (): Promise<void> => {
    setIsExporting(true);
    try {
      const selectedData = codes.filter(code => selectedCodes.has(code.id));
      const zip = new JSZip();
      
      const qrFolder = zip.folder("qr-codes");
      if (!qrFolder) throw new Error("Failed to create zip folder");
      
      await Promise.all(selectedData.map(async (code) => {
        try {
          const svgContent = await generateQRCodeSVG(code.code);
          qrFolder.file(`${code.code}.svg`, svgContent);
        } catch (error) {
          console.error(`Error generating QR code for ${code.code}:`, error);
        }
      }));
      
      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, 'qr-codes.zip');
    } catch (error) {
      console.error('Error generating QR codes:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const markSelectedAsCopied = async (): Promise<void> => {
    if (onUpdateStatus && selectedCodes.size > 0) {
      await onUpdateStatus(Array.from(selectedCodes));
      setSelectedCodes(new Set());
    }
  };

  return (
    <div className="mt-6 flow-root">
      {selectedCodes.size > 0 && (
        <div className="mb-4 flex gap-2">
          <Button
            onClick={exportToExcel}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <FileDown className="w-4" />
            Export Excel
          </Button>
          <Button
            onClick={exportToQR}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={isExporting}
          >
            <QrCode className="w-4" />
            {isExporting ? 'Generating...' : 'Export QR Codes'}
          </Button>
          <Button
            onClick={markSelectedAsCopied}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <CheckIcon className="w-4" />
            Mark as Copied
          </Button>
        </div>
      )}
      
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="md:hidden">
            {codes?.map((code) => (
              <div key={code.id} className="mb-2 w-full rounded-md p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCodes.has(code.id)}
                      onChange={() => toggleSelect(code.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{new Date(code.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="text-sm">{code.code}</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <Badge variant={code.copied ? 'secondary' : 'default'}>
                      {code.copied ? (
                        <>
                          Copied
                          <CheckIcon className="ml-1 w-4" />
                        </>
                      ) : (
                        <>
                          Pending
                          <ClockIcon className="ml-1 w-4" />
                        </>
                      )}
                    </Badge>
                    <DeleteCode id={code.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <table className="hidden min-w-full md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  <input
                    type="checkbox"
                    checked={selectedCodes.size === codes?.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Code
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Created At
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {codes?.map((code) => (
                <tr
                  key={code.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <input
                      type="checkbox"
                      checked={selectedCodes.has(code.id)}
                      onChange={() => toggleSelect(code.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p>{code.code}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {new Date(code.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Badge variant={code.copied ? 'secondary' : 'default'}>
                      {code.copied ? (
                        <>
                          Copied
                          <CheckIcon className="ml-1 w-4" />
                        </>
                      ) : (
                        <>
                          Pending
                          <ClockIcon className="ml-1 w-4" />
                        </>
                      )}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <DeleteCode id={code.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CodesTable;