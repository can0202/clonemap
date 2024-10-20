// import * as XLSX from 'xlsx';
import * as XLSX from 'sheetjs-style';

export const exportToExcel = (data, infoLoan, filename) => {
  const workbook = XLSX.utils.book_new();
  const modifiedData = data.map((item) => {
    const modifiedItem = {
      'Kỳ hạn': item.kyhan,
      'Lãi phải trả': item.laiphaitra,
      'Gốc phải trả': item.gocphaitra,
      'Số tiền phải trả': item.sotienphaitra,
      'Số tiền còn lại': item.sotienconlai,
    };
    return modifiedItem;
  });
  const worksheet = XLSX.utils.json_to_sheet(modifiedData);

  // Define the new rows
  const newRows = [
    ['CHI TIẾT KHOẢN VAY'],
    [],
    ['Số tiền vay', `${data[0]?.sotienconlai}`],
    ['Thời hạn vay', `${infoLoan?.thoi_han_vay}`],
    ['Lãi suất', `${infoLoan?.lai_suat}`],
    ['Hình thức', `${infoLoan?.hinh_thuc}`],
    [],
  ];

  //Insert the new rows at the beginning of the worksheet
  const currentData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
  });
  const updatedData = [...newRows, ...currentData];
  const updatedWorksheet = XLSX.utils.aoa_to_sheet(updatedData);

  const merge = [
    {s: {r: 0, c: 0}, e: {r: 0, c: 4}},
    {s: {r: 1, c: 0}, e: {r: 1, c: 4}},
    {s: {r: 6, c: 0}, e: {r: 6, c: 4}},
  ];
  updatedWorksheet['!merges'] = merge;

  // Set Cols Width
  const wscols = [
    {wch: 15},
    {wch: 15},
    {wch: 15},
    {wch: 15},
    {wch: 15},
    {wch: 15},
  ];
  updatedWorksheet['!cols'] = wscols;

  // Style cell Header
  updatedWorksheet['A1'].s = {
    fill: {
      patternType: 'solid', // none / solid
      fgColor: {rgb: 'd1132a'},
      bgColor: {rgb: 'd1132a'},
    },
    font: {
      color: {rgb: 'ffffff'},
      bold: true,
    },
    alignment: {
      horizontal: 'center',
    },
  };

  // Style Cell Row
  const cellStyleRow = {
    font: {
      color: {rgb: '000000'},
      bold: true,
      italic: true,
      sz: 11,
    },
    alignment: {
      horizontal: 'left',
    },
  };

  const cellStyleCol = {
    font: {
      color: {rgb: '000000'},
      bold: true,
      sz: 11,
    },
    alignment: {
      horizontal: 'center',
    },
  };

  ['A3', 'A4', 'A5', 'A6'].forEach((cell) => {
    updatedWorksheet[cell].s = cellStyleRow;
  });

  ['A8', 'B8', 'C8', 'D8', 'E8'].forEach((cell) => {
    updatedWorksheet[cell].s = cellStyleCol;
  });

  XLSX.utils.book_append_sheet(workbook, updatedWorksheet, 'Dự Toán Khoản Vay');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
