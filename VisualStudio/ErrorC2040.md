## C2040

以下みたいなエラーが出た時。

```
C2040 'memcpy': 'void *(void *,const void *,size_t)' は 'void *(void *,const void *,size_t)' と間接操作のレベルが異なります。
```

```
C2040: 'memcpy' : 'void (char *,const char *,int )' differs in levels of indirection from 'void *(void *,const void *,unsigned int )'
```

### 対処例

```
#ifndef memcpy
#include<vcruntime_string.h>
#endif
```
