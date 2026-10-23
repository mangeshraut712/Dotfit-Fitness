type Row = Record<string, unknown>;
type Column = { name: string };
type Order = { op: "desc"; column: string } | Column;
type Filter = { op: "eq"; column: string; value: unknown };

function col(name: string): Column {
  return { name };
}

export const contactsTable = {
  id: col("id"),
  name: col("name"),
  phone: col("phone"),
  email: col("email"),
  plan: col("plan"),
  message: col("message"),
  status: col("status"),
  createdAt: col("createdAt"),
};

export const conversations = {
  id: col("id"),
  title: col("title"),
  createdAt: col("createdAt"),
};

export const messages = {
  id: col("id"),
  conversationId: col("conversationId"),
  role: col("role"),
  content: col("content"),
  createdAt: col("createdAt"),
};

const tables = {
  contacts: [] as Row[],
  conversations: [] as Row[],
  messages: [] as Row[],
};

const ids = { contacts: 0, conversations: 0, messages: 0 };

export function resetMemoryDb(): void {
  tables.contacts = [];
  tables.conversations = [];
  tables.messages = [];
  ids.contacts = 0;
  ids.conversations = 0;
  ids.messages = 0;
}

function tableKey(table: unknown): keyof typeof tables {
  if (table === contactsTable) return "contacts";
  if (table === conversations) return "conversations";
  if (table === messages) return "messages";
  throw new Error("Unknown table");
}

function orderRows(rows: Row[], order: Order): Row[] {
  const descending = "op" in order && order.op === "desc";
  const column = descending ? order.column : order.name;
  const direction = descending ? -1 : 1;
  return [...rows].sort((left, right) => {
    const a = left[column];
    const b = right[column];
    if (a instanceof Date && b instanceof Date) return (a.getTime() - b.getTime()) * direction;
    if (typeof a === "number" && typeof b === "number") return (a - b) * direction;
    return String(a).localeCompare(String(b)) * direction;
  });
}

function query(rows: Row[]) {
  let current = rows.map((row) => ({ ...row }));
  const builder = {
    where(filter: Filter) {
      current = current.filter((row) => row[filter.column] === filter.value);
      return builder;
    },
    orderBy(order: Order) {
      current = orderRows(current, order);
      return builder;
    },
    then(
      onFulfilled?: (value: Row[]) => unknown,
      onRejected?: (reason: unknown) => unknown,
    ) {
      return Promise.resolve(current).then(onFulfilled, onRejected);
    },
  };
  return builder;
}

function stamp(kind: keyof typeof tables, data: Row): Row {
  const row = { ...data };
  if (kind === "contacts") {
    row.id = ++ids.contacts;
    row.status = row.status ?? "New";
    row.message = row.message ?? null;
    row.createdAt = new Date(Date.UTC(2026, 0, ids.contacts));
  } else if (kind === "conversations") {
    row.id = ++ids.conversations;
    row.createdAt = new Date(Date.UTC(2026, 0, ids.conversations));
  } else {
    row.id = ++ids.messages;
    row.createdAt = new Date(Date.UTC(2026, 0, 1, 0, ids.messages));
  }
  tables[kind].push(row);
  return row;
}

export const db = {
  insert(table: unknown) {
    return {
      values(data: Row) {
        const row = stamp(tableKey(table), data);
        const promise = Promise.resolve();
        return {
          returning: () => Promise.resolve([{ ...row }]),
          then: (
            onFulfilled?: (value: void) => unknown,
            onRejected?: (reason: unknown) => unknown,
          ) => promise.then(onFulfilled, onRejected),
        };
      },
    };
  },
  select() {
    return {
      from(table: unknown) {
        return query(tables[tableKey(table)]);
      },
    };
  },
  update(table: unknown) {
    return {
      set(patch: Row) {
        return {
          where(filter: Filter) {
            return {
              returning: async () => {
                const key = tableKey(table);
                const updated: Row[] = [];
                for (const row of tables[key]) {
                  if (row[filter.column] === filter.value) {
                    Object.assign(row, patch);
                    updated.push({ ...row });
                  }
                }
                return updated;
              },
            };
          },
        };
      },
    };
  },
  delete(table: unknown) {
    return {
      where(filter: Filter) {
        return {
          returning: async () => {
            const key = tableKey(table);
            const removed: Row[] = [];
            const kept: Row[] = [];
            for (const row of tables[key]) {
              if (row[filter.column] === filter.value) removed.push({ ...row });
              else kept.push(row);
            }
            tables[key] = kept;
            if (key === "conversations") {
              tables.messages = tables.messages.filter((row) => row.conversationId !== filter.value);
            }
            return removed;
          },
        };
      },
    };
  },
};

export function createDbModule() {
  return { db, contactsTable, conversations, messages };
}
