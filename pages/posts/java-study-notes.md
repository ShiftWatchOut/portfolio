---
title: Java 学习笔记
date: 2023/6/16
tag: java
description: Javascript 包含了 Java，所以我学学也很正常吧
author: ShiftWatchOut
---
- [Java 学习笔记](#java-学习笔记)
  - [1 C-like 语言所共有基础](#1-c-like-语言所共有基础)
    - [1.1 值声明](#11-值声明)
    - [1.2 运算符](#12-运算符)
    - [1.3 方法声明](#13-方法声明)
    - [1.3 流程控制](#13-流程控制)
    - [1.4 异常处理](#14-异常处理)
  - [2 面向对象](#2-面向对象)
    - [2.1 继承和多态](#21-继承和多态)
    - [2.2 抽象类和接口](#22-抽象类和接口)
    - [2.3 修饰符](#23-修饰符)
    - [2.4 泛型](#24-泛型)
    - [2.5 注解](#25-注解)
    - [2.6 反射](#26-反射)
  - [3 总结](#3-总结)

# Java 学习笔记

Java是一门具有编译时和运行时的语言，介于编译型语言和解释型语言之间。javac 先将代码编译成一种“字节码”（.class 文件），再放到针对不同平台编写的虚拟机上（JVM）运行，实现了“一次编写，到处运行”的效果。

## 1 C-like 语言所共有基础

### 1.1 值声明

```
类型 标识符 = 右值;
```

类型包括基础类型和复合类型（引用类型）：

1. 基础类型

| **类型**  | **占据字节**    | **取值范围**                               | **对应的引用类型**  |
| --------- | --------------- | ------------------------------------------ | ------------------- |
| `byte`    | 1               | -128 ~ 127                                 | java.lang.Byte      |
| `short`   | 2               | -32768 ~ 32767                             | java.lang.Short     |
| `int`     | 4               | -2147483648 ~ 2147483647                   | java.lang.Integer   |
| `long`    | 8               | -9223372036854775808 ~ 9223372036854775807 | java.lang.Long      |
| `float`   | 4               | -2^128 ~ +2^128, 6~7 位有效数字            | java.lang.Float     |
| `double`  | 8               | -2^1024 ~ +2^1024，15~16 位有效数字        | java.lang.Double    |
| `char`    | 2               | 0 ~ 65535，Unicode 集合                    | java.lang.Character |
| `boolean` | 取决于 jvm 实现 | true，false                                | java.lang.Boolean   |

 *有一个例外：void，值为 null*

2. 复合类型：除了基础类型全都是复合类型，可理解为标识符指向了复合变量的地址

值得一提的是，在“一切皆对象”的编程语言中，一个基础类型的值自身并不是对象，也就是说不能通过 `.` 来访问任何方法或属性，需要借助各自的包装类型，很多情况下编译器会自动装包（Auto Boxing）、解包（Auto Unboxing），也可以通过包装类型的静态工厂方法 `对应包装类型.valueOf(基础类型值)` 手动创建对象。

### 1.2 运算符


| **运算符类别** | **包含**                                                             |
| -------------- | -------------------------------------------------------------------- |
| 算术运算符     | `+`、`-`、`*`、`/`、`%`、`++`、`--`                                  |
| 关系运算符     | `==`、`!=`、`>`、`>=`、`<`、`<=`                                     |
| 位运算符       | `＆`、`\|`、`^`、`〜`、`<<`、`>>`、`>>>`                             |
| 逻辑运算符     | `&&`、`\|\|`、`!`                                                    |
| 赋值运算符     | `=`、`+=`、`-=`、`*=`、`/=`、`％=`、`<<=`、`>>=`、`＆=`、`^=`、`\|=` |
| 其他运算符     | `?:`、`instanceof`                                                   |


### 1.3 方法声明

```
修饰符 返回值类型 标识符(参数类型 标识符 ...) throws 异常... {
    ...
}
```

### 1.3 流程控制

| **流程名** | **代码模板**                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------- |
| 条件       | `if (条件表达式) {...} else if (条件表达式) {...} else {...}`                                   |
| 多重选择   | `switch(表达式) { case 1: case 2: ...;break;  default: ...;break; }` 比较整型、字符串或枚举类型 |
| while 循环 | `while (条件表达式) { ...}`，`do { ... } while (条件表达式);`                                   |
| for 循环   | `for (初始执行语句; 循环条件; 循环后执行语句) {...}`，`for (类型 标识符: 可迭代对象) { ... }`   |
| 跳出循环   | `break` 跳出当前循环，`continue` 提前结束本次循环，均可跳转至循环前的 `label`                   |

### 1.4 异常处理

```java
try {
    String s = processFile(“C:\\test.txt”);
    // 一切正常会继续执行 try 中的部分
    
    throw new Exception(); // 自行抛出异常
} catch (FileNotFoundException e) {
    // 文件未找到

    e.printStackTrace(); // 打印异常栈信息
} catch (SecurityException e) {
    // 没有读取权限

    throw new RuntimeException(e); // 包装后再次抛出
} catch (IOException | NumberFormatException e) {
    // io 错误
} catch (Exception e) {
    // 其他错误
    // 越基础的基类需要越靠后，不然作为基类被捕获后永远不会被作为子类捕获
} finally {
    // 无论前面的代码块正常还是错误，最终都会执行，即使有 return
}
```

## 2 面向对象

### 2.1 继承和多态

```java
class Person {
    String name; // 引用类型默认初始化为 null
    public int age; // 基本类型有各自默认值，int 默认初始化为 0，boolean 初始化为 false

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    // 参数类型不同，方法重载，调用时会自动区分
    public Person(String name) {
        this.name = name;
        this.age = 12;
    }
    
    public String getName() {
        return this.name;
    }

    public int getAge() {
        return this.age;
    }
}

class Student extends Person {
    private int score;
    protected int grade;

    public int getScore() {
        return score;
    }

    // 覆盖父类相同签名方法，加 `@Override` 让编译器帮忙检查是否进行了正确的覆盖
    @Override
    public String getName() {
        return "Stu: " + super.getName();
    }
}
```

### 2.2 抽象类和接口

```java
abstract class AbstractClass {
    String v;
    public void name() {
    };

    // 允许没有具体实现的方法，必须由非抽象子类完成实现
    abstract void fun();

    // 不允许静态抽象方法，可用的修饰符只有 public 和 protected
    // 以下语句会报错
    // static abstract void test();
}

interface ITest {
    // 接口只允许定义抽象实例方法，没有实例字段
    // 接口中定义的字段，即使不带 static 和 final 也是静态和引用不可变的。
    String StaticConstant = "";

    void run();

    default void remove() {
        throw new UnsupportedOperationException("remove");
    }
}

class RealClass extends AbstractClass implements ITest {
    void fun() {    }

    public void run() {
        this.v.hashCode();
        RealClass.StaticConstant.hashCode();
    }
}
```

Java中的继承是单继承的，一个子类只能继承一个父类，但是可以实现多个接口。

有一种特殊的接口，有且只有一个抽象方法，被称之为函数式接口（`@FunctionalInterface`），在需要实现了这种接口的类的地方，可以用 lambda 表达式 `(参数列表) -> {...}` 或函数引用 `System.out::println` 来替代，简化书写。

### 2.3 修饰符

| **修饰符**     | **作用**                                                                   |
| -------------- | -------------------------------------------------------------------------- |
| `public`       | 表示该成员可以被任何类访问                                                 |
| `protected`    | 表示该成员只能被同一个包内的类或者该类的子类访问                           |
| `private`      | 表示该成员只能被该类内部的其他方法访问，无法被其他类访问                   |
| `default`      | 表示该成员只能被同一个包内的类访问（默认）                                 |
| `static`       | 表示该成员属于类本身，而不是属于类的实例。可以通过类名直接访问             |
| `final`        | 表示该成员的值不能被修改，或者该类不能被继承                               |
| `abstract`     | 表示该成员只有声明，没有实现，必须在子类中实现                             |
| `synchronized` | 表示该方法在多线程环境下是线程安全的，即同一时间只有一个线程能够访问该方法 |
| `volatile`     | 表示该成员的值可能在多线程环境下被修改，需要立即同步                       |
| `transient`    | 表示该成员在序列化过程中将被忽略                                           |

1. `synchronized` 除了用作方法的修饰符之外，也可以用方法内，将代码块变为原子操作。

```java
public class TestThread {
    Object lock = new Object();
    public void testMethod() {
        // 只能锁住引用类型
        synchronized (lock) {
            ...
        }
        ...
        // 作为修饰符的 synchronized 实际是下面代码的语法糖
        synchronized (this) {
            ...
        }
    }
    public synchronized void syncMethod() { ... }
}
```

2. `final` 修饰基本类型时，值不可变，修饰引用类型时，仅代表引用不可变，下面字段仍是可变的，并不代表引用所指向的值变成了不可变对象。

```java
class Point {
    int x;
    int y;
    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}

final Point p = new Point(0, 0);
// p = new Point(1, 0);
p.x = 1;
```

### 2.4 泛型

泛型就是定义一种模板，可以适应任意类型，例如 `ArrayList<T>`，然后在代码中为用到的类创建对应的 `ArrayList<类型>`

```java
public class ArrayList<T> implements List<T> {
    ...
}

// <> 外可以使用父类进行声明，尖括号内不行
List<String> list = new ArrayList<String>();

// 创建ArrayList<Integer>类型：
ArrayList<Integer> integerList = new ArrayList<Integer>();
// 添加一个Integer：
integerList.add(new Integer(123));
// “向上转型”为ArrayList<Number>：
ArrayList<Number> numberList = integerList;
// 添加一个Float，因为Float也是Number：
numberList.add(new Float(12.34));
// 从ArrayList<Integer>获取索引为1的元素（即添加的Float）：
Integer n = integerList.get(1); // ClassCastException!

// 在接口中定义泛型
public interface Comparable<T> {
    int compareTo(T o);
}

public interface Iterable<T> {
    Iterator<T> iterator();
}

// 在类中定义泛型
public class Pair<T> {
    private T first;
    private T last;
    public Pair(T first, T last) {
        this.first = first;
        this.last = last;
    }
    public T getFirst() { ... }
    public T getLast() { ... }

    // 静态泛型方法应该使用其他类型区分:
    public static <K> Pair<K> create(K first, K last) {
        return new Pair<K>(first, last);
    }
}
```

Java语言的泛型实现方式是擦拭法

```java
// 虚拟机实际执行的代码
public class Pair {
    private Object first;
    private Object last;
    public Pair(Object first, Object last) {
        this.first = first;
        this.last = last;
    }
    public Object getFirst() {
        return first;
    }
    public Object getLast() {
        return last;
    }
}
```

局限：
1. `<T>`不能是基本类型：`Pair<int> p = new Pair<>(1, 2); // compile error!`
2. 无法取得带泛型的Class：`Pair<String>.class` 实际上还是 `Pair.class`
3. 无法判断带泛型的类型：`p instanceof Pair<String> // Compile error`
4. 不能实例化T类型：不允许 `new T()`

### 2.5 注解

注解是放在 Java 源码的类、方法、字段、参数前的一种特殊“注释”，可以被编译器读取而不像注释那样完全被编译器忽略。

```java
// 定义注解
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Controller {
    String name() default "";
}
```

### 2.6 反射

Java的反射是指程序在运行期可以拿到一个对象的所有信息。在运行期，不直接导入某个实例的类，依然可以调用这个实例的方法和访问修改字段。

1. 类 Class

```java
// 获取类作为 Class 类型的实例，方法 1
Class cls = String.class;
// 方法 2
String s = "Hello";
Class cls = s.getClass();
// 方法 3
Class cls = Class.forName("java.lang.String");

// 直接比较 class 和使用 instanceof 的差别
Integer n = new Integer(123);
n instanceof Integer; // true，因为n是Integer类型
n instanceof Number; // true，因为n是Number类型的子类

n.getClass() == Integer.class; // true，因为n.getClass()返回Integer.class
n.getClass() == Number.class; // false，因为Integer.class!=Number.class

Integer.class.isAssignableFrom(Integer.class); // true，因为Integer可以赋值给Integer
Number.class.isAssignableFrom(Integer.class); // true，因为Integer可以赋值给Number
Object.class.isAssignableFrom(Integer.class); // true，因为Integer可以赋值给Object

Class s = Integer.class.getSuperclass();
Class[] is = s.getInterfaces();
```

2. 字段 Field

| **Class 方法**                 | **说明**                                      |
| ------------------------------ | --------------------------------------------- |
| `Field getField(name)`         | 根据字段名获取某个public的field（包括父类）   |
| `Field getDeclaredField(name)` | 根据字段名获取当前类的某个field（不包括父类） |
| `Field[] getFields()`          | 获取所有public的field（包括父类）             |
| `Field[] getDeclaredFields()`  | 获取当前类的所有field（不包括父类）           |

| **Field 方法**             | **说明**                                               |
| -------------------------- | ------------------------------------------------------ |
| `String getName()`         | 返回字段名称，例如，`"name"`                           |
| `Class getType()`          | 返回字段类型，也是一个Class实例，例如，String.class    |
| `int getModifiers()`       | 返回字段的修饰符，它是一个int，不同的bit表示不同的含义 |
| `Object get(实例) `        | 获取指定实例该字段的值                                 |
| `void set(实例, 新值)`     | 设定指定实例的字段为新值                               |
| `void setAccessible(true)` | 忽略可见性修饰符，一律允许访问，可能会失败             |


3. 方法 Method

| **Class 方法**                             | **说明**                             |
| ------------------------------------------ | ------------------------------------ |
| `Method getMethod(name, Class...)`         | 获取某个public的Method（包括父类）   |
| `Method getDeclaredMethod(name, Class...)` | 获取当前类的某个Method（不包括父类） |
| `Method[] getMethods() `                   | 获取所有public的Method（包括父类）   |
| `Method[] getDeclaredMethods()`            | 获取当前类的所有Method（不包括父类） |

| **Method 方法**                        | **说明**                                                                      |
| -------------------------------------- | ----------------------------------------------------------------------------- |
| `String getName()`                     | 返回方法名称，例如：`"getScore"`；                                            |
| `Class getReturnType()`                | 返回方法返回值类型，也是一个Class实例，例如：`String.class`；                 |
| `Class[] getParameterTypes()`          | 返回方法的参数类型，是一个Class数组，例如：`{String.class,  Integer.class}`； |
| `int getModifiers()`                   | 返回方法的修饰符，它是一个int，不同的bit表示不同的含义。                      |
| `Object invoke(实例, 可变参数列表...)` | 调用指定实例方法并获取结果                                                    |
| `void setAccessible(true)`             | 忽略可见性修饰符，一律允许调用，可能会失败                                    |

4. 构造方法 `Constructor`

| **Class 方法**                     | **说明**                    |
| ---------------------------------- | --------------------------- |
| `getConstructor(Class...)`         | 获取某个public的Constructor |
| `getDeclaredConstructor(Class...)` | 获取某个Constructor         |
| `getConstructors()`                | 获取所有public的Constructor |
| `getDeclaredConstructors()`        | 获取所有Constructor         |

| **Constructor 方法**       | **说明**               |
| -------------------------- | ---------------------- |
| `newInstance(参数列表...)` | 创建一个实例对象       |
| `setAccessible(true)`      | 访问非 public 构造方法 |

## 3 总结

Java 以面向对象的编程范式闻名于世，但它面向对象的问题在于它还不够面向对象：

1. 基本类型还需要借助包装类型，才有方法可调用。像 JS、Rust 等更新的语言中基本类型无需再包装
2. 如 `System.out::println` 这种方法的引用不算对象。像 JS、Kotlin 中函数也是对象
3. 运算符如`+`、`-`操作作为一种行为却没有广泛可用的接口，仅额外支持 `String` 类型的相加

作为一门历史悠久的语言，其诞生有时代局限性，但也激发出后续更完善的语言，并仍在继续发展。