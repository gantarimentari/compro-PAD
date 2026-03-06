import React, { useState } from 'react';
import { SearchIcon, CloseIcon, TrashIcon, AddIcon, PenIcon} from '@ds/icons';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';

const Vaccination_COLUMNS = [
  { key: 'name', header: 'Nama Pasien' },
  { key: 'phoneNumber', header: 'Nomor HP' },
  { key: 'email', header: 'Email' },
  { key: 'date', header: 'Tanggal Dibuat' },
  { key: 'actions', header: 'Aksi', isAction: true },
];